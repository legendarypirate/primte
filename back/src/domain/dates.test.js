const { test } = require('node:test');
const assert = require('node:assert/strict');
const { toDateOnly, todayDateOnly, addMonthsDateOnly, membershipDates } = require('./dates');

test('toDateOnly turns empty and invalid values into the fallback', () => {
  assert.equal(toDateOnly(''), null);
  assert.equal(toDateOnly('Invalid date'), null);
  assert.equal(toDateOnly('not-a-date', '2026-11-11'), '2026-11-11');
  assert.equal(toDateOnly(undefined), undefined);
});

test('toDateOnly keeps calendar dates without timezone shift', () => {
  assert.equal(toDateOnly('1999-03-22'), '1999-03-22');
  assert.equal(toDateOnly('1999.03.22'), '1999-03-22');
  assert.equal(toDateOnly('1999-03-22T00:00:00.000+08:00'), '1999-03-22');
});

test('membershipDates defaults start to today and end to +3 months', () => {
  const now = new Date(2026, 10, 11);
  assert.deepEqual(membershipDates('', '', now), {
    validFrom: '2026-11-11',
    validTo: '2027-02-11',
  });
  assert.deepEqual(membershipDates('2026-09-15', '', now), {
    validFrom: '2026-09-15',
    validTo: '2026-12-15',
  });
});

test('todayDateOnly and addMonthsDateOnly format as YYYY-MM-DD', () => {
  assert.equal(todayDateOnly(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(addMonthsDateOnly('2026-01-31', 1), '2026-03-03');
});
