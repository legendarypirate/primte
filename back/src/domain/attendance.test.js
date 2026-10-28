const { test } = require('node:test');
const assert = require('node:assert/strict');
const { attendanceHours, makeGatePayload, parseGatePayload } = require('./attendance');

test('full hours between check-in and check-out become XP hours', () => {
  assert.equal(attendanceHours('2026-10-28T10:00:00Z', '2026-10-28T11:00:00Z'), 1);
  assert.equal(attendanceHours('2026-10-28T10:00:00Z', '2026-10-28T12:50:00Z'), 2);
  assert.equal(attendanceHours('2026-10-28T10:00:00Z', '2026-10-28T10:59:00Z'), 0);
  assert.equal(attendanceHours('2026-10-28T12:00:00Z', '2026-10-28T11:00:00Z'), 0);
});

test('gate payloads verify direction and expire', () => {
  const now = 1_700_000_000_000;
  const inn = makeGatePayload('IN', now);
  const out = makeGatePayload('OUT', now);
  assert.equal(parseGatePayload(inn, now), 'IN');
  assert.equal(parseGatePayload(out, now), 'OUT');
  assert.equal(parseGatePayload(inn, now + 91_000), null);
  assert.equal(parseGatePayload('PRIME|4007|1', now), null);
  assert.equal(parseGatePayload(inn.replace('|IN|', '|OUT|'), now), null);
});
