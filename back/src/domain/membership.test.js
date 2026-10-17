const { test } = require('node:test');
const assert = require('node:assert/strict');
const { computeMembershipLevel, membershipLabel, addExperience } = require('./membership');

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

test('addExperience increments XP/RP and recalculates level', () => {
  assert.deepEqual(addExperience({ xp: 0, rp: 0 }, { xp: 51 }), { xp: 51, rp: 0, level: 1 });
  assert.deepEqual(addExperience({ xp: 51, rp: 0 }, { rp: 151 }), { xp: 51, rp: 151, level: 2 });
  assert.deepEqual(addExperience({ xp: 51, rp: 151 }, { xp: 150, rp: 450 }), { xp: 201, rp: 601, level: 3 });
});

test('addExperience does not go below zero', () => {
  assert.deepEqual(addExperience({ xp: 10, rp: 5 }, { xp: -40, rp: -1 }), { xp: 0, rp: 4, level: 0 });
});
