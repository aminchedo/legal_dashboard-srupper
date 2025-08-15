"""Example usage of ResilientProxyRotator.

Run with: python examples/python/resilient_proxy_example.py
"""

from resilient_proxy import ResilientProxyRotator
import logging
import os
import sys
from typing import List

import requests

# Ensure local package path is available without installation
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))

PY_SRC_PATHS = [
    os.path.join(PROJECT_ROOT, "python"),        # preferred top-level python/
    os.path.join(PROJECT_ROOT, "src", "python"),  # fallback legacy src/python/
]
for p in PY_SRC_PATHS:
    if p not in sys.path and os.path.isdir(p):
        sys.path.insert(0, p)


def build_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            )
        }
    )
    return session


def main() -> None:
    logging.basicConfig(level=logging.INFO)

    # Example proxies with authentication; replace with real ones
    proxies: List[str] = [
        # "http://username:password@host1:port",
        # "http://username:password@host2:port",
    ]

    rotator = ResilientProxyRotator(proxies, cooldown_period=60)
    rotator.set_timeouts(connect_timeout_s=15, read_timeout_s=30)

    session = build_session()

    url = "https://httpbin.org/get"
    response = rotator.make_request(url, session=session, max_retries=3)
    if response is None:
        print("Request failed with all proxies")
    else:
        print("Status:", response.status_code)
        print("JSON:", response.json())

    # Monitoring snapshot
    status = rotator.get_status()
    print("Monitoring snapshot:")
    for proxy, s in status["proxy_stats"].items():
        print(proxy, s)
    print("Blacklist seconds remaining:",
          status["blacklist_seconds_remaining"])


if __name__ == "__main__":
    main()
