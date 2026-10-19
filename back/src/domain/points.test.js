const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  applyPointDelta,
  clampAbsoluteScores,
  isTrainingMatch,
  competitionXpAward,
  XP_AWARDS,
} = require('./points');

test('XP awards match club rules', () => {
  assert.equal(XP_AWARDS.trainingHour.xp, 1);
  assert.equal(XP_AWARDS.trainingMatch.xp, 5);
  assert.equal(XP_AWARDS.competition.xp, 10);
});

test('applyPointDelta ignores negative XP and allows RP down', () => {
  const next = applyPointDelta({ xp: 51, rp: 151 }, { xp: -10, rp: -20 });
  assert.equal(next.xp, 51);
  assert.equal(next.xpDelta, 0);
  assert.equal(next.rp, 131);
  assert.equal(next.rpDelta, -20);
  assert.equal(next.level, 1);
});

test('clampAbsoluteScores never lowers XP', () => {
  const next = clampAbsoluteScores({ xp: 80, rp: 200 }, { xp: 40, rp: 90 });
  assert.equal(next.xp, 80);
  assert.equal(next.rp, 90);
  assert.equal(next.xpDelta, 0);
  assert.equal(next.rpDelta, -110);
});

test('training matches award +5 XP', () => {
  assert.equal(competitionXpAward({ title: 'Winter бэлтгэл', tags: [] }).xp, 5);
  assert.equal(competitionXpAward({ title: 'PRIME CUP', tags: [] }).xp, 10);
  assert.equal(isTrainingMatch({ MatchType: { name: 'Practice Match' } }), true);
});
