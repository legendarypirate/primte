const { test } = require('node:test');
const assert = require('node:assert/strict');
const { startOfClubDay, mergeClubStatus } = require('./club');

test('startOfClubDay is midnight in Ulaanbaatar', () => {
  const start = startOfClubDay(new Date('2026-10-28T02:30:00.000Z'));
  assert.equal(start.toISOString(), '2026-10-27T16:00:00.000Z');
});

test('mergeClubStatus uses live attendance and stored open/capacity', () => {
  assert.deepEqual(mergeClubStatus({ open: false, todayCount: 12, capacity: 40 }, { todayCount: 3 }), {
    open: false,
    todayCount: 3,
    capacity: 40,
  });
  assert.deepEqual(mergeClubStatus({}, { todayCount: 0 }), {
    open: true,
    todayCount: 0,
    capacity: 40,
  });
});
