#!/usr/bin/env python3
import json
from pathlib import Path

import urllib.error
import urllib.request

LOGIN_URL = "https://api.tactical.mn/api/v1/auth/login"
USERS_URL = "https://api.tactical.mn/api/v1/users?page=1&per_page=500"
OUT_PATH = Path(__file__).with_name("tactical_users.json")

CODE = "S105"
PASSWORD = "99031919"


def request_json(url, *, method="GET", body=None, token=None):
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            payload = {"raw": raw}
        return exc.code, payload


def extract_token(payload):
    if not isinstance(payload, dict):
        return None
    for key in ("token", "access_token", "accessToken"):
        value = payload.get(key)
        if isinstance(value, str) and value:
            return value
    data = payload.get("data")
    if isinstance(data, dict):
        return extract_token(data)
    auth = payload.get("auth")
    if isinstance(auth, dict):
        return extract_token(auth)
    return None


def login():
    status, payload = request_json(
        LOGIN_URL,
        method="POST",
        body={"usercode": CODE, "password": PASSWORD},
    )
    token = extract_token(payload)
    if status >= 400 or not token:
        raise SystemExit(f"Login failed ({status}): {payload}")
    return token, payload


def main():
    token, login_payload = login()
    status, users = request_json(USERS_URL, token=token)
    if status >= 400:
        raise SystemExit(f"Users fetch failed ({status}): {users}")
    OUT_PATH.write_text(json.dumps(users, ensure_ascii=False, indent=2), encoding="utf-8")
    count = users.get("data") if isinstance(users, dict) else users
    if isinstance(count, list):
        n = len(count)
    elif isinstance(users, dict) and isinstance(users.get("users"), list):
        n = len(users["users"])
    else:
        n = "unknown"
    print(f"Saved {n} users to {OUT_PATH}")
    print(f"Login keys: {list(login_payload) if isinstance(login_payload, dict) else type(login_payload)}")


if __name__ == "__main__":
    main()
