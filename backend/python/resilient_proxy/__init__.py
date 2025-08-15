"""Resilient Proxy Rotation package.

This package provides `ResilientProxyRotator`, a production-ready proxy rotation
utility designed for robust web scraping with intelligent blacklisting, retry
logic, and monitoring.
"""

from .rotator import ResilientProxyRotator, ProxyStats  # noqa: F401

__all__ = ["ResilientProxyRotator", "ProxyStats"]
