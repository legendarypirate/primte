const { test } = require('node:test');
const assert = require('node:assert/strict');
const { computeMembershipLevel, membershipLabel } = require('./membership');

test('new members stay Student until XP exceeds 50', () => {
  assert.equal(computeMembershipLevel(0, 0), 0);
  assert.equal(computeMembershipLevel(50, 999), 0);
  assert.equal(membershipLabel(0), 'Student member');
});

test('XP over 50 is Level 1', () => {
  assert.equal(computeMembershipLevel(51, 0), 1);
  assert.equal(computeMembershipLevel(51, 150), 1);
  assert.equal(membershipLabel(1), 'Level 1 member');
});

test('XP over 50 and RP over 150 is Level 2', () => {
  assert.equal(computeMembershipLevel(51, 151), 2);
  assert.equal(computeMembershipLevel(200, 600), 2);
  assert.equal(membershipLabel(2), 'Level 2 member');
});

test('XP over 200 and RP over 600 is Level 3', () => {
  assert.equal(computeMembershipLevel(201, 601), 3);
  assert.equal(membershipLabel(3), 'Level 3 member');
});
