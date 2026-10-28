const { test } = require('node:test');
const assert = require('node:assert/strict');
const { memberCodesEqual, memberCodeUnlocks } = require('./member-code');

test('score confirm accepts the current member code, ignoring case and spaces', () => {
  assert.equal(memberCodesEqual('4007', '4007'), true);
  assert.equal(memberCodesEqual(' 4007 ', '4007'), true);
  assert.equal(memberCodesEqual('prime-000125', 'PRIME-000125'), true);
  assert.equal(memberCodesEqual('4008', '4007'), false);
  assert.equal(memberCodesEqual('', '4007'), false);
});

test('stale pin hash still unlocks when the live member code matches', async () => {
  const member = { memberCode: '4007', pinHash: 'hash-of-old-code' };
  const ok = await memberCodeUnlocks(member, '4007', async () => false);
  assert.equal(ok, true);
});

test('legacy pin hash still works if it matches the typed code', async () => {
  const member = { memberCode: 'S0001', pinHash: 'legacy' };
  const ok = await memberCodeUnlocks(member, '9911', async (candidate, hash) => candidate === '9911' && hash === 'legacy');
  assert.equal(ok, true);
});

test('wrong code does not unlock', async () => {
  const member = { memberCode: '4007', pinHash: 'legacy' };
  const ok = await memberCodeUnlocks(member, '0000', async () => false);
  assert.equal(ok, false);
});
