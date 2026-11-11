const { test } = require('node:test');
const assert = require('node:assert/strict');
const { splitName, displayName, resolveMemberNames } = require('./names');

test('splitName uses the first word as first name', () => {
  assert.deepEqual(splitName('Altangerel D'), { firstName: 'Altangerel', lastName: 'D' });
  assert.deepEqual(splitName('Temuulen'), { firstName: 'Temuulen', lastName: '' });
});

test('displayName joins first and last name', () => {
  assert.equal(displayName('Altangerel', 'D'), 'Altangerel D');
  assert.equal(displayName('Temuulen', ''), 'Temuulen');
});

test('resolveMemberNames prefers explicit first/last and keeps a combined name', () => {
  assert.deepEqual(resolveMemberNames({ firstName: 'Anu', lastName: 'Bat' }), {
    firstName: 'Anu',
    lastName: 'Bat',
    name: 'Anu Bat',
  });
  assert.deepEqual(resolveMemberNames({ name: 'Altangerel D' }), {
    firstName: 'Altangerel',
    lastName: 'D',
    name: 'Altangerel D',
  });
});
