"""Minimal HTTP access to the fixed MiniMax endpoint for the non-chat tools.

Shares credentials (``resolve_api_key``) and the endpoint constant with
``minimax_client``. Errors carry a status code and a short server message,
never request bodies, headers or the API key.
"""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

import httpx

from .minimax import MINIMAX_BASE_URL, REQUEST_TIMEOUT_S, resolve_api_key

MAX_ERROR_CHARS = 200
# Documented base_resp codes worth naming; anything else shows the code only.
BASE_RESP_HINTS = {
    1002: "rate limit triggered; retry later",
    1004: "authentication failed; check the API key",
    1008: "insufficient account balance",
    1026: "sensitive content detected in the prompt",
    2013: "invalid input parameters",
    2049: "invalid API key",
}


class MiniMaxAPIError(RuntimeError):
    """The API rejected a request. ``str()`` is safe to show to users."""

    def __init__(self, message: str, *, status: int | None = None, code: int | None = None):
        super().__init__(message)
        self.status = status
        self.code = code


class MiniMaxHTTP:
    def __init__(
        self,
        *,
        env: Mapping[str, str] | None = None,
        transport: httpx.BaseTransport | None = None,
        timeout: float = REQUEST_TIMEOUT_S,
    ) -> None:
        self._env = env
        self._transport = transport
        self._timeout = timeout
        self._client: httpx.Client | None = None

    def _http(self) -> httpx.Client:
        if self._client is None:
            api_key = resolve_api_key(self._env)  # fails before any client exists
            self._client = httpx.Client(
                base_url=MINIMAX_BASE_URL,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=self._timeout,
                transport=self._transport,
            )
        return self._client

    def request(self, method: str, path: str, *, json: Any | None = None) -> dict[str, Any]:
        try:
            response = self._http().request(method, path, json=json)
        except httpx.TimeoutException:
            raise MiniMaxAPIError(f"{method} {path} timed out") from None
        except httpx.HTTPError as exc:
            raise MiniMaxAPIError(f"{method} {path} failed ({type(exc).__name__})") from None

        try:
            body = response.json()
        except ValueError:
            body = None
        if response.status_code >= 400:
            raise MiniMaxAPIError(
                f"{method} {path} returned HTTP {response.status_code}" + _detail(body),
                status=response.status_code,
            )
        if not isinstance(body, dict):
            raise MiniMaxAPIError(f"{method} {path} returned a non-JSON body")
        base = body.get("base_resp")
        if isinstance(base, dict) and base.get("status_code") not in (None, 0):
            code = base["status_code"]
            hint = BASE_RESP_HINTS.get(code, "request rejected")
            raise MiniMaxAPIError(f"MiniMax error {code}: {hint}", code=code)
        return body


def _detail(body: Any) -> str:
    """A short, bounded server message when one is present; never the whole body."""
    if not isinstance(body, dict):
        return ""
    msg: Any = None
    base = body.get("base_resp")
    if isinstance(base, dict):
        msg = base.get("status_msg")
    error = body.get("error")
    if not msg and isinstance(error, dict):
        msg = error.get("message")
    return f": {msg[:MAX_ERROR_CHARS]}" if isinstance(msg, str) and msg else ""
