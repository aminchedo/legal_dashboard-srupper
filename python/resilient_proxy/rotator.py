from __future__ import annotations

import logging
import time
from collections import deque
from dataclasses import dataclass
from typing import Any, Deque, Dict, List, Optional

try:
    import requests
    from requests import Response
    from requests.exceptions import (
        ConnectTimeout,
        ConnectionError,
        HTTPError,
        ProxyError,
        ReadTimeout,
        RequestException,
        Timeout,
        TooManyRedirects,
    )
except Exception:  # pragma: no cover
    requests = None  # type: ignore
    Response = Any  # type: ignore
    ProxyError = ConnectTimeout = ReadTimeout = ConnectionError = HTTPError = Timeout = TooManyRedirects = RequestException = Exception  # type: ignore


@dataclass
class ProxyStats:
    successes: int = 0
    failures: int = 0
    total_response_time_s: float = 0.0
    last_error: Optional[str] = None
    last_used_ts: float = 0.0

    def success_rate(self) -> float:
        total = self.successes + self.failures
        return (self.successes / total) if total > 0 else 0.0

    def average_response_time(self) -> float:
        return (
            (self.total_response_time_s /
             self.successes) if self.successes > 0 else float("inf")
        )


class ResilientProxyRotator:
    DEFAULT_CONNECT_TIMEOUT_S: float = 15.0
    DEFAULT_READ_TIMEOUT_S: float = 30.0

    def __init__(self, proxies_list: List[str], cooldown_period: int = 300) -> None:
        self.logger = logging.getLogger(self.__class__.__name__)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

        self._proxies: Deque[str] = deque(proxies_list or [])
        self._blacklist_until_ts: Dict[str, float] = {}
        self._cooldown_period_s: int = int(cooldown_period)

        self._connect_timeout_s: float = self.DEFAULT_CONNECT_TIMEOUT_S
        self._read_timeout_s: float = self.DEFAULT_READ_TIMEOUT_S

        self._proxy_stats: Dict[str, ProxyStats] = {
            p: ProxyStats() for p in list(self._proxies)}
        self._total_successes: int = 0
        self._total_failures: int = 0

        self.logger.info(
            "Initialized with %d proxies, cooldown=%ds",
            len(self._proxies),
            self._cooldown_period_s,
        )

    def _rotate_proxy(self) -> Optional[str]:
        if not self._proxies:
            self.logger.warning("_rotate_proxy called with empty proxy list")
            return None
        self._proxies.rotate(-1)
        return self._proxies[0]

    def get_proxy(self) -> Optional[str]:
        if not self._proxies:
            return None
        now = time.time()
        num_proxies = len(self._proxies)

        best_proxy: Optional[str] = None
        best_score: float = float("-inf")

        for _ in range(num_proxies):
            candidate = self._rotate_proxy()
            if candidate is None:
                return None

            until_ts = self._blacklist_until_ts.get(candidate)
            if until_ts is not None and now < until_ts:
                self.logger.debug(
                    "Proxy on cooldown for %.1fs: %s",
                    max(0.0, until_ts - now),
                    candidate,
                )
                continue
            if until_ts is not None and now >= until_ts:
                del self._blacklist_until_ts[candidate]
                self.logger.info(
                    "Rehabilitated proxy after cooldown: %s", candidate)

            stats = self._proxy_stats.setdefault(candidate, ProxyStats())
            success_rate = stats.success_rate()
            avg_time = stats.average_response_time()
            score = (success_rate * 1.0) - (0.05 * min(avg_time, 60.0))
            if score > best_score:
                best_score = score
                best_proxy = candidate

        if best_proxy is None:
            self.logger.warning(
                "All proxies are on cooldown; no proxy available")
        return best_proxy

    def blacklist_proxy(self, proxy: str, reason: str = "", error: Optional[BaseException] = None) -> None:
        if not proxy:
            return
        until_ts = time.time() + float(self._cooldown_period_s)
        self._blacklist_until_ts[proxy] = until_ts
        err_text = f" | error={error!r}" if error else ""
        self.logger.info(
            "Blacklisted proxy until %.0f (cooldown=%ds): %s | reason=%s%s",
            until_ts,
            self._cooldown_period_s,
            proxy,
            reason or "unspecified",
            err_text,
        )

    def make_request(
        self,
        url: str,
        session: Optional["requests.Session"],
        max_retries: int = 3,
        request_kwargs: Optional[Dict[str, Any]] = None,
    ) -> Optional[Response]:
        if requests is None:  # pragma: no cover
            raise RuntimeError(
                "The 'requests' package is required to use make_request")

        sess = session or requests.Session()
        kwargs: Dict[str, Any] = dict(request_kwargs or {})
        backoff_base_s: float = float(kwargs.pop("backoff_base_s", 0.0) or 0.0)
        backoff_cap_s: float = float(kwargs.pop("backoff_cap_s", 30.0) or 30.0)
        if "timeout" not in kwargs:
            kwargs["timeout"] = (self._connect_timeout_s, self._read_timeout_s)

        attempts = 0
        last_error: Optional[BaseException] = None

        while attempts < max_retries:
            proxy = self.get_proxy()
            if not proxy:
                break
            attempts += 1
            start_ts = time.time()
            self.logger.info("Attempt %d/%d via proxy: %s",
                             attempts, max_retries, proxy)
            try:
                response: Response = sess.get(
                    url,
                    proxies={"http": proxy, "https": proxy},
                    allow_redirects=True,
                    **kwargs,
                )
                if response.status_code == 407:
                    self._record_failure(
                        proxy, time.time() - start_ts, "Proxy Auth (407)")
                    self.blacklist_proxy(
                        proxy, reason="proxy_auth_failure (407)")
                    last_error = HTTPError("Proxy auth required (407)")
                    continue
                try:
                    response.raise_for_status()
                except HTTPError as http_err:
                    status = response.status_code
                    reason = f"http_error_{status}"
                    self._record_failure(
                        proxy, time.time() - start_ts, reason, error=http_err)
                    self.blacklist_proxy(proxy, reason=reason, error=http_err)
                    last_error = http_err
                    continue
                elapsed = time.time() - start_ts
                self._record_success(proxy, elapsed)
                return response
            except (ProxyError, ConnectTimeout, ReadTimeout, Timeout) as timeout_err:
                elapsed = time.time() - start_ts
                self._record_failure(
                    proxy, elapsed, "timeout_or_proxy_error", error=timeout_err)
                self.blacklist_proxy(
                    proxy, reason="timeout_or_proxy_error", error=timeout_err)
                last_error = timeout_err
                if backoff_base_s > 0:
                    sleep_s = min(backoff_cap_s, backoff_base_s *
                                  (2 ** (attempts - 1)))
                    time.sleep(max(0.0, sleep_s))
                continue
            except (ConnectionError,) as conn_err:
                elapsed = time.time() - start_ts
                self._record_failure(
                    proxy, elapsed, "connection_error", error=conn_err)
                self.blacklist_proxy(
                    proxy, reason="connection_error", error=conn_err)
                last_error = conn_err
                if backoff_base_s > 0:
                    sleep_s = min(backoff_cap_s, backoff_base_s *
                                  (2 ** (attempts - 1)))
                    time.sleep(max(0.0, sleep_s))
                continue
            except (TooManyRedirects,) as redir_err:
                elapsed = time.time() - start_ts
                self._record_failure(
                    proxy, elapsed, "too_many_redirects", error=redir_err)
                self.blacklist_proxy(
                    proxy, reason="too_many_redirects", error=redir_err)
                last_error = redir_err
                if backoff_base_s > 0:
                    sleep_s = min(backoff_cap_s, backoff_base_s *
                                  (2 ** (attempts - 1)))
                    time.sleep(max(0.0, sleep_s))
                continue
            except (RequestException,) as req_err:
                elapsed = time.time() - start_ts
                self._record_failure(
                    proxy, elapsed, "request_exception", error=req_err)
                self.blacklist_proxy(
                    proxy, reason="request_exception", error=req_err)
                last_error = req_err
                if backoff_base_s > 0:
                    sleep_s = min(backoff_cap_s, backoff_base_s *
                                  (2 ** (attempts - 1)))
                    time.sleep(max(0.0, sleep_s))
                continue
            except Exception as unexpected:
                elapsed = time.time() - start_ts
                self._record_failure(
                    proxy, elapsed, "unexpected_error", error=unexpected)
                self.blacklist_proxy(
                    proxy, reason="unexpected_error", error=unexpected)
                last_error = unexpected
                if backoff_base_s > 0:
                    sleep_s = min(backoff_cap_s, backoff_base_s *
                                  (2 ** (attempts - 1)))
                    time.sleep(max(0.0, sleep_s))
                continue

        self.logger.error(
            "Request failed after %d attempts; last_error=%r", attempts, last_error)
        return None

    def _record_success(self, proxy: str, elapsed_s: float) -> None:
        stats = self._proxy_stats.setdefault(proxy, ProxyStats())
        stats.successes += 1
        stats.total_response_time_s += elapsed_s
        stats.last_error = None
        stats.last_used_ts = time.time()
        self._total_successes += 1
        self.logger.info("Success via %s in %.2fs | success_rate=%.2f",
                         proxy, elapsed_s, stats.success_rate())

    def _record_failure(self, proxy: str, elapsed_s: float, reason: str, error: Optional[BaseException] = None) -> None:
        stats = self._proxy_stats.setdefault(proxy, ProxyStats())
        stats.failures += 1
        stats.total_response_time_s += max(0.0, elapsed_s)
        stats.last_error = str(error) if error else reason
        stats.last_used_ts = time.time()
        self._total_failures += 1
        self.logger.warning(
            "Failure via %s in %.2fs | reason=%s | last_error=%s | success_rate=%.2f",
            proxy,
            elapsed_s,
            reason,
            stats.last_error,
            stats.success_rate(),
        )

    def get_status(self) -> Dict[str, Any]:
        now = time.time()
        blacklist_view = {p: max(0.0, until - now)
                          for p, until in self._blacklist_until_ts.items()}
        stats_view = {
            p: {
                "successes": s.successes,
                "failures": s.failures,
                "success_rate": s.success_rate(),
                "avg_response_time_s": s.average_response_time(),
                "last_error": s.last_error,
                "last_used_ts": s.last_used_ts,
            }
            for p, s in self._proxy_stats.items()
        }
        return {
            "total_successes": self._total_successes,
            "total_failures": self._total_failures,
            "blacklist_seconds_remaining": blacklist_view,
            "proxy_stats": stats_view,
            "configured_proxies": list(self._proxies),
        }

    def set_timeouts(self, connect_timeout_s: float = 15.0, read_timeout_s: float = 30.0) -> None:
        self._connect_timeout_s = float(connect_timeout_s)
        self._read_timeout_s = float(read_timeout_s)
        self.logger.info(
            "Updated timeouts: connect=%.1fs read=%.1fs",
            self._connect_timeout_s,
            self._read_timeout_s,
        )

    def set_cooldown(self, cooldown_period_s: int) -> None:
        self._cooldown_period_s = int(cooldown_period_s)
        self.logger.info("Updated cooldown to %ds", self._cooldown_period_s)

    def add_proxies(self, new_proxies: List[str]) -> None:
        added = 0
        existing = set(self._proxies)
        for p in new_proxies:
            if p not in existing:
                self._proxies.append(p)
                self._proxy_stats.setdefault(p, ProxyStats())
                added += 1
        if added:
            self.logger.info("Added %d proxies; total now %d",
                             added, len(self._proxies))

    def remove_proxy(self, proxy: str) -> None:
        try:
            self._proxies.remove(proxy)
        except ValueError:
            return
        self._blacklist_until_ts.pop(proxy, None)
        self._proxy_stats.pop(proxy, None)
        self.logger.info("Removed proxy: %s; total now %d",
                         proxy, len(self._proxies))
