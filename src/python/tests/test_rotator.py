import time
from typing import Any, Dict, Optional

import pytest

from src.python.resilient_proxy import ResilientProxyRotator


class FakeResponse:
    def __init__(self, status_code: int = 200, json_data: Optional[Dict[str, Any]] = None):
        self.status_code = status_code
        self._json_data = json_data or {}

    def raise_for_status(self) -> None:
        if 400 <= self.status_code:
            raise Exception(f"HTTP {self.status_code}")

    def json(self) -> Dict[str, Any]:
        return self._json_data


class DummySession:
    """Session stub that fails for given proxies.

    - If proxy string contains "fail", raise ConnectionError
    - If proxy string contains "timeout", raise Timeout
    - If proxy string contains "auth407", return 407
    - Otherwise return 200
    """

    class _ConnErr(Exception):
        pass

    class _TimeoutErr(Exception):
        pass

    def get(self, url: str, proxies: Dict[str, str], **kwargs) -> FakeResponse:
        proxy = proxies.get("http") or ""
        if "fail" in proxy:
            raise DummySession._ConnErr("connection failed")
        if "timeout" in proxy:
            raise DummySession._TimeoutErr("timeout")
        if "auth407" in proxy:
            return FakeResponse(status_code=407)
        if "http500" in proxy:
            return FakeResponse(status_code=500)
        return FakeResponse(status_code=200, json_data={"ok": True, "proxy": proxy})


def test_rotation_and_blacklist_rehabilitation() -> None:
    proxies = ["http://p1", "http://p2", "http://p3"]
    r = ResilientProxyRotator(proxies, cooldown_period=1)

    # Blacklist p2; should skip to p3
    r.blacklist_proxy("http://p2", reason="test")

    order = [r.get_proxy(), r.get_proxy(), r.get_proxy()]
    assert order == ["http://p1", "http://p3", "http://p1"]

    # After cooldown, p2 becomes available again
    time.sleep(1.1)
    assert r.get_proxy() == "http://p2"


def test_make_request_success_after_failures() -> None:
    proxies = [
        "http://fail-1",
        "http://timeout-2",
        "http://ok-3",
    ]
    r = ResilientProxyRotator(proxies, cooldown_period=1)
    session = DummySession()

    resp = r.make_request("https://example.com", session, max_retries=3)
    assert resp is not None
    status = r.get_status()
    assert status["total_successes"] == 1
    # First two should be blacklisted
    bl = status["blacklist_seconds_remaining"]
    assert any("fail-1" in p for p in bl.keys())
    assert any("timeout-2" in p for p in bl.keys())


def test_http_error_blacklists_proxy() -> None:
    proxies = ["http://http500-1", "http://ok-2"]
    r = ResilientProxyRotator(proxies, cooldown_period=1)
    session = DummySession()

    resp = r.make_request("https://example.com", session, max_retries=2)
    assert resp is not None
    status = r.get_status()
    assert status["total_successes"] == 1
    assert status["total_failures"] >= 1
