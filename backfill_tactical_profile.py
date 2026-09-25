#!/usr/bin/env python3
"""Fill email, birthday, gender, classification on production members from tactical_users.json."""
import json
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://primeapi.teensclub.mn"
USERS_PATH = Path(__file__).with_name("tactical_users.json")
ADMIN_EMAIL = "admin@prime.mn"
ADMIN_PASSWORD = "PrimeAdmin0328"

CLASS = {1: "Unclassified", 2: "D", 3: "C", 4: "B", 5: "A", 6: "M"}


def request_json(url, *, method="GET", body=None, token=None):
    headers = {"Accept": "application/json", "Content-Type": "application/json"}
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


def profile(user):
    birthday = str(user.get("birthday") or "")[:10] or None
    gender = {1: "эр", 0: "эм"}.get(user.get("gender"))
    return {
        "email": user.get("email") or None,
        "birthday": birthday,
        "gender": gender,
        "classification": CLASS.get(int(user.get("class_id") or 0), None),
    }


def main():
    users = json.loads(USERS_PATH.read_text(encoding="utf-8")).get("data") or []
    by_code = {}
    for user in users:
        by_code.setdefault(str(user.get("usercode") or "").strip(), []).append(user)

    status, login = request_json(
        f"{API}/api/auth/admin/login",
        method="POST",
        body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    token = login.get("token") if isinstance(login, dict) else None
    if status >= 400 or not token:
        raise SystemExit(f"Admin login failed ({status}): {login}")

    _, existing = request_json(f"{API}/api/admin/members", token=token)
    members = existing.get("members") or []
    used = set()
    updated = skipped = failed = 0
    sample = None

    for member in members:
        code = str(member.get("memberCode") or "").strip()
        base = code.split("-")[0]
        pool = by_code.get(code) or by_code.get(base) or []
        user = None
        for candidate in pool:
            key = id(candidate)
            if key in used:
                continue
            name = f"{candidate.get('firstname') or ''} {candidate.get('lastname') or ''}".strip()
            if code == str(candidate.get("usercode") or "").strip() or name == member.get("name"):
                user = candidate
                used.add(key)
                break
        if user is None and pool:
            user = next((c for c in pool if id(c) not in used), None)
            if user:
                used.add(id(user))
        if not user:
            skipped += 1
            continue
        body = profile(user)
        st, payload = request_json(f"{API}/api/admin/members/{member['id']}", method="PUT", body=body, token=token)
        if st >= 400:
            failed += 1
            if failed <= 3:
                print("fail", member.get("memberCode"), st, payload)
            continue
        updated += 1
        if member.get("memberCode") == "S105":
            sample = payload.get("member") if isinstance(payload, dict) else payload
        time.sleep(0.01)

    print(f"updated={updated} skipped={skipped} failed={failed}")
    if sample:
        print("S105", {k: sample.get(k) for k in ("name", "memberCode", "email", "birthday", "gender", "classification")})


if __name__ == "__main__":
    main()
