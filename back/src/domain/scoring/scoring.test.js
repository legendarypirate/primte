const { test } = require('node:test');
const assert = require('node:assert/strict');
const { IPSC_HANDGUN, IPSC_ACTION_AIR } = require('./scoring-profile');
const { POWER_FACTOR } = require('./scoring-types');
const {
  calculateHitPoints,
  calculatePenaltyPoints,
  calculatePointsAfterPenalty,
  calculateEffectivePoints,
  calculateHitFactor,
  calculateStagePoints,
  calculateStagePercentage,
  calculateMatchPoints,
  calculateMatchPercentage,
  calculateScore,
  calculateStageRanking,
  formatHitFactor,
} = require('./scoring-engine');

const minorInput = {
  alphaHits: 14,
  charlieHits: 5,
  deltaHits: 1,
  missCount: 1,
  noShootCount: 0,
  proceduralCount: 1,
  otherPenaltyPoints: 0,
  timeSeconds: 18.5,
};

test('Minor scoring worked test case', () => {
  const result = calculateScore(IPSC_HANDGUN, POWER_FACTOR.MINOR, minorInput);
  assert.equal(result.hitPoints, 86);
  assert.equal(result.penaltyPoints, 20);
  assert.equal(result.pointsAfterPenalty, 66);
  assert.equal(result.effectivePoints, 66);
  assert.ok(Math.abs(result.hitFactor - 66 / 18.5) < 1e-8);
  assert.equal(formatHitFactor(result.hitFactor), '3.5676');

  const stagePoints = calculateStagePoints(result.hitFactor, 4.5, 100);
  assert.ok(Math.abs(stagePoints - (result.hitFactor / 4.5) * 100) < 1e-6);
  assert.ok(Math.abs(stagePoints - 79.279279279) < 1e-4);
});

test('Major scoring', () => {
  const hitPoints = calculateHitPoints(IPSC_HANDGUN, POWER_FACTOR.MAJOR, {
    alphaHits: 10,
    charlieHits: 6,
    deltaHits: 2,
  });
  assert.equal(hitPoints, 78);
});

test('Action Air scoring ignores power factor', () => {
  const hits = { alphaHits: 10, charlieHits: 6, deltaHits: 2 };
  const major = calculateHitPoints(IPSC_ACTION_AIR, POWER_FACTOR.MAJOR, hits);
  const minor = calculateHitPoints(IPSC_ACTION_AIR, POWER_FACTOR.MINOR, hits);
  assert.equal(major, 70);
  assert.equal(minor, 70);
});

test('Zero score clamp', () => {
  const profile = IPSC_HANDGUN;
  const hitPoints = 20;
  const penaltyPoints = calculatePenaltyPoints(profile, {
    missCount: 3,
    noShootCount: 0,
    proceduralCount: 0,
    otherPenaltyPoints: 0,
  });
  assert.equal(penaltyPoints, 30);
  const pap = calculatePointsAfterPenalty(hitPoints, penaltyPoints);
  assert.equal(pap, -10);
  const effective = calculateEffectivePoints(profile, pap);
  assert.equal(effective, 0);
  const hf = calculateHitFactor(effective, 10);
  assert.equal(hf, 0);
  const sp = calculateStagePoints(hf, 4.5, 100);
  assert.equal(sp, 0);
});

test('Division separation in stage ranking', () => {
  const production = calculateStageRanking(
    [
      { competitorId: 'a', divisionId: 'prod', hitFactor: 3.5676, competitorStatus: 'ACTIVE', status: 'SIGNED' },
      { competitorId: 'b', divisionId: 'prod', hitFactor: 4.5, competitorStatus: 'ACTIVE', status: 'SIGNED' },
    ],
    100
  );
  assert.equal(production[0].competitorId, 'b');
  assert.equal(production[0].stagePoints, 100);

  const open = calculateStageRanking(
    [{ competitorId: 'c', divisionId: 'open', hitFactor: 2.1, competitorStatus: 'ACTIVE', status: 'SIGNED' }],
    100
  );
  assert.equal(open[0].stagePoints, 100);
});

test('Match total and percentage', () => {
  const total = calculateMatchPoints([89.1234, 97.3321, 79.2793]);
  assert.ok(Math.abs(total - 265.7348) < 1e-3);
  const pct = calculateMatchPercentage(total, total);
  assert.equal(pct, 100);
});

test('Hit factor never NaN or Infinity', () => {
  assert.equal(calculateHitFactor(0, 0), 0);
  assert.equal(calculateHitFactor(-5, 10), 0);
  assert.ok(Number.isFinite(calculateHitFactor(66, 18.5)));
});

test('Stage percentage winner is 100%', () => {
  const pct = calculateStagePercentage(100, 100);
  assert.equal(pct, 100);
});
