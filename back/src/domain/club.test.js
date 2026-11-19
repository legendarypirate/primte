const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  startOfClubDay,
  mergeClubStatus,
  clubTime,
  clubWeekday,
  normalizeClock,
  normalizeClubHours,
} = require('./club');

test('startOfClubDay is midnight in Ulaanbaatar', () => {
  const start = startOfClubDay(new Date('2026-10-28T02:30:00.000Z'));
  assert.equal(start.toISOString(), '2026-10-27T16:00:00.000Z');
});

test('clubWeekday uses Ulaanbaatar calendar day', () => {
  assert.equal(clubWeekday(new Date('2026-10-28T02:30:00.000Z')), 3);
});

test('normalizeClock pads and rejects invalid times', () => {
  assert.equal(normalizeClock('9:05'), '09:05');
  assert.equal(normalizeClock('10:00:00'), '10:00');
  assert.equal(normalizeClock('24:00', '10:00'), '10:00');
  assert.equal(normalizeClock('abc', '22:00'), '22:00');
});

test('normalizeClubHours fills seven days and keeps closed days', () => {
  const hours = normalizeClubHours([
    { weekday: 7, open: false, start: '11:00', end: '18:00' },
    { weekday: 1, open: true, start: '9:00', end: '21:30' },
  ]);
  assert.equal(hours.length, 7);
  assert.deepEqual(hours[0], { weekday: 1, open: true, start: '09:00', end: '21:30' });
  assert.deepEqual(hours[6], { weekday: 7, open: false, start: '11:00', end: '18:00' });
  assert.equal(hours[2].weekday, 3);
  assert.equal(hours[2].open, true);
});

test('mergeClubStatus uses live attendance, stored open/capacity, and weekly hours', () => {
  const now = new Date('2026-10-28T02:30:00.000Z');
  const merged = mergeClubStatus(
    { open: false, todayCount: 12, capacity: 40, hours: [{ weekday: 3, open: false, start: '12:00', end: '18:00' }] },
    { todayCount: 3, now },
  );
  assert.equal(merged.open, false);
  assert.equal(merged.todayCount, 3);
  assert.equal(merged.capacity, 40);
  assert.equal(merged.hours.length, 7);
  assert.equal(merged.hours[2].today, true);
  assert.equal(merged.hours[2].label, 'Лхагва');
  assert.equal(merged.hours[2].open, false);
  assert.equal(merged.hours[2].start, '12:00');

  const fallback = mergeClubStatus({}, { todayCount: 0, now });
  assert.equal(fallback.open, true);
  assert.equal(fallback.todayCount, 0);
  assert.equal(fallback.capacity, 40);
  assert.equal(fallback.hours[0].start, '10:00');
  assert.equal(fallback.hours[0].end, '22:00');
});

test('clubTime formats hours in Ulaanbaatar', () => {
  assert.equal(clubTime(new Date('2026-10-28T02:30:00.000Z')), '10:30');
});
