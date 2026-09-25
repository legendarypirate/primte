#!/usr/bin/env python3
import json
import re
import time
import urllib.error
import urllib.request
from collections import Counter
from pathlib import Path

API = "https://primeapi.teensclub.mn"
USERS_PATH = Path(__file__).with_name("tactical_users.json")
REPORT_PATH = Path(__file__).with_name("tactical_import_report.json")
ADMIN_EMAIL = "admin@prime.mn"
ADMIN_PASSWORD = "PrimeAdmin0328"


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


def slug(value):
    text = re.sub(r"[^a-z0-9._-]+", "", str(value or "").strip().lower())
    return text or "member"


def display_name(user):
    first = str(user.get("firstname") or "").strip()
    last = str(user.get("lastname") or "").strip()
    return " ".join(part for part in (first, last) if part) or str(user.get("usercode") or "member")


def pick_type(user, types):
    enabled = user.get("enabled") is not False
    kind = int(user.get("usertype") or 0)
    if not enabled:
        return types["official-inactive"] if kind in (1, 2, 9) else types["student-inactive"]
    if kind == 0:
        return types["student-member"]
    if kind == 9:
        return types["official-l2"]
    return types["official-l1"]


def unique_code(code, used):
    base = str(code or "").strip() or "0000"
    candidate = base
    n = 2
    while candidate.lower() in used:
        candidate = f"{base}-{n}"
        n += 1
    used.add(candidate.lower())
    return candidate


def unique_username(base, used):
    candidate = slug(base)
    n = 2
    while candidate in used:
        candidate = f"{slug(base)}{n}"
        n += 1
    used.add(candidate)
    return candidate


def main():
    users = json.loads(USERS_PATH.read_text(encoding="utf-8")).get("data") or []
    status, login = request_json(
        f"{API}/api/auth/admin/login",
        method="POST",
        body={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    token = login.get("token") if isinstance(login, dict) else None
    if status >= 400 or not token:
        raise SystemExit(f"Admin login failed ({status}): {login}")

    _, lookups = request_json(f"{API}/api/admin/lookups", token=token)
    types = {row["slug"]: row["id"] for row in lookups.get("memberTypes") or []}
    _, existing = request_json(f"{API}/api/admin/members", token=token)
    members = existing.get("members") or []
    used_codes = {str(m.get("memberCode") or "").lower() for m in members}
    used_usernames = {str(m.get("username") or "").lower() for m in members if m.get("username")}

    created, skipped, failed = [], [], []
    for user in users:
        raw_code = str(user.get("usercode") or "").strip()
        if raw_code.lower() in used_codes:
            skipped.append({"usercode": raw_code, "name": display_name(user), "reason": "memberCode already exists"})
            continue
        member_code = unique_code(raw_code, used_codes)
        username = unique_username(user.get("firstname") or member_code, used_usernames)
        if username == "member":
            username = unique_username(f"u{member_code}", used_usernames)
        body = {
            "name": display_name(user),
            "username": username,
            "memberCode": member_code,
            "phone": user.get("phone_no") or None,
            "avatarUrl": user.get("img_url") or None,
            "status": "active" if user.get("enabled") is not False else "inactive",
            "memberTypeId": pick_type(user, types),
            "level": 1,
            "rank": 0,
            "walletBalance": 0,
        }
        st, payload = request_json(f"{API}/api/admin/members", method="POST", body=body, token=token)
        if st >= 400:
            failed.append({"usercode": raw_code, "name": body["name"], "status": st, "error": payload})
            used_codes.discard(member_code.lower())
            used_usernames.discard(username)
            continue
        created.append({"usercode": member_code, "name": body["name"], "username": username})
        time.sleep(0.02)

    report = {
        "source": len(users),
        "created": len(created),
        "skipped": len(skipped),
        "failed": len(failed),
        "skippedRows": skipped,
        "failedRows": failed,
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"created={len(created)} skipped={len(skipped)} failed={len(failed)}")
    print(f"report {REPORT_PATH}")
    if failed:
        print("failures", Counter(str(row.get("error"))[:80] for row in failed))


if __name__ == "__main__":
    main()
