const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  parseCertLevel,
  inferCompetitionTier,
  grantsFor,
  formatGrants,
  canWorkPosition,
  canEnterScores,
  nextTrainingProgress,
  meetsAnnualQuota,
} = require('./judge-levels');

test('parses certification levels, checking III before II', () => {
  assert.equal(parseCertLevel('LEVEL_I_RO'), 'LEVEL_I_RO');
  assert.equal(parseCertLevel('LEVEL II RO'), 'LEVEL_II_RO');
  assert.equal(parseCertLevel('LEVEL_III_RO'), 'LEVEL_III_RO');
  assert.equal(parseCertLevel('NROI'), 'NROI');
  assert.equal(parseCertLevel(null), 'LEVEL_I_RO');
});

test('infers competition tiers from titles and tags', () => {
  assert.equal(inferCompetitionTier({ title: 'Өвлийн бэлтгэл тэмцээн' }), 'TRAINING');
  assert.equal(inferCompetitionTier({ level: 'Club Level 1' }), 'CLUB_L1');
  assert.equal(inferCompetitionTier({ title: 'Клубийн 2-р түвшний тэмцээн' }), 'CLUB_L2');
  assert.equal(inferCompetitionTier({ title: 'МПБХ УАШТ' }), 'MPBH');
  assert.equal(inferCompetitionTier({ level: 'Level 3' }), 'MPBH');
});

test('training match duties follow the club table', () => {
  assert.equal(formatGrants(grantsFor('LEVEL_I_RO', 'TRAINING')), 'ARO');
  assert.equal(formatGrants(grantsFor('LEVEL_II_RO', 'TRAINING')), 'RO');
  assert.deepEqual(grantsFor('LEVEL_III_RO', 'TRAINING'), []);
  assert.deepEqual(grantsFor('NROI', 'TRAINING'), []);
});

test('club level 1 duties include RM and MD exceptions', () => {
  assert.equal(canWorkPosition('LEVEL_I_RO', 'CLUB_L1', 'ARO'), false);
  assert.equal(canWorkPosition('LEVEL_II_RO', 'CLUB_L1', 'ARO'), true);
  assert.equal(canWorkPosition('LEVEL_II_RO', 'CLUB_L1', 'RO'), false);
  assert.equal(canWorkPosition('LEVEL_II_RO', 'CLUB_L1', 'RO', { rmApproved: true }), true);
  assert.equal(canWorkPosition('LEVEL_III_RO', 'CLUB_L1', 'RO'), true);
  assert.equal(canWorkPosition('LEVEL_III_RO', 'CLUB_L1', 'CRO'), false);
  assert.equal(canWorkPosition('LEVEL_III_RO', 'CLUB_L1', 'RM', { mdAppointed: true }), true);
  assert.equal(canWorkPosition('NROI', 'CLUB_L1', 'RO'), true);
});

test('club level 2 and MPBH share the same duty table', () => {
  for (const tier of ['CLUB_L2', 'MPBH']) {
    assert.deepEqual(grantsFor('LEVEL_I_RO', tier), []);
    assert.equal(canWorkPosition('LEVEL_II_RO', tier, 'ARO'), false);
    assert.equal(canWorkPosition('LEVEL_II_RO', tier, 'ARO', { rmApproved: true }), true);
    assert.equal(canWorkPosition('LEVEL_III_RO', tier, 'ARO'), true);
    assert.equal(canWorkPosition('LEVEL_III_RO', tier, 'RO'), false);
    assert.equal(canWorkPosition('LEVEL_III_RO', tier, 'RO', { rmApproved: true }), true);
    assert.equal(canWorkPosition('NROI', tier, 'RO'), true);
  }
});

test('score entry is RO work except dedicated staff roles', () => {
  assert.equal(canEnterScores('LEVEL_I_RO', 'TRAINING', 'RO'), false);
  assert.equal(canEnterScores('LEVEL_II_RO', 'TRAINING', 'RO'), true);
  assert.equal(canEnterScores('LEVEL_I_RO', 'TRAINING', 'SCOREKEEPER'), true);
});

test('next-level hours: 45 ARO then 60 ARO + 30 RO or 30 L1 ARO', () => {
  assert.equal(nextTrainingProgress('LEVEL_I_RO').eligible, false);
  assert.equal(nextTrainingProgress('LEVEL_I_RO', { trainingAro: 45 }).eligible, true);
  assert.equal(nextTrainingProgress('LEVEL_II_RO', { trainingAro: 60, trainingRo: 29 }).eligible, false);
  assert.equal(nextTrainingProgress('LEVEL_II_RO', { trainingAro: 60, trainingRo: 30 }).eligible, true);
  assert.equal(nextTrainingProgress('LEVEL_II_RO', { clubL1Aro: 30 }).eligible, true);
});

test('LEVEL III annual quota is 60 hours or drop a level', () => {
  assert.equal(meetsAnnualQuota('LEVEL_I_RO'), true);
  assert.equal(meetsAnnualQuota('LEVEL_III_RO'), false);
  assert.equal(meetsAnnualQuota('LEVEL_III_RO', { annualYtd: 60 }), true);
});
