const Decimal = require('decimal.js');
const { POWER_FACTOR } = require('./scoring-types');

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

function d(value) {
  return new Decimal(value ?? 0);
}

function resolveHitValues(profile, powerFactor) {
  if (!profile.powerFactorEnabled || powerFactor === POWER_FACTOR.NONE) {
    return profile.minor;
  }
  return powerFactor === POWER_FACTOR.MAJOR ? profile.major : profile.minor;
}

function calculateHitPoints(profile, powerFactor, hits) {
  const values = resolveHitValues(profile, powerFactor);
  return d(hits.alphaHits)
    .mul(values.A)
    .plus(d(hits.charlieHits).mul(values.C))
    .plus(d(hits.deltaHits).mul(values.D))
    .toNumber();
}

function calculatePenaltyPoints(profile, penalties) {
  return d(penalties.missCount)
    .mul(profile.missPenalty)
    .plus(d(penalties.noShootCount).mul(profile.noShootPenalty))
    .plus(d(penalties.proceduralCount).mul(profile.proceduralPenalty))
    .plus(d(penalties.otherPenaltyPoints || 0))
    .toNumber();
}

function calculatePointsAfterPenalty(hitPoints, penaltyPoints) {
  return d(hitPoints).minus(penaltyPoints).toNumber();
}

function calculateEffectivePoints(profile, pointsAfterPenalty) {
  const min = profile.minimumStagePoints ?? 0;
  return Decimal.max(d(pointsAfterPenalty), d(min)).toNumber();
}

function calculateHitFactor(effectivePoints, timeSeconds) {
  if (timeSeconds <= 0 || effectivePoints <= 0) return 0;
  const hf = d(effectivePoints).div(timeSeconds);
  if (!hf.isFinite()) return 0;
  return hf.toNumber();
}

function formatHitFactor(hitFactor, precision = 4) {
  if (!Number.isFinite(hitFactor) || hitFactor <= 0) return '0.0000'.slice(0, precision + 2);
  return d(hitFactor).toFixed(precision);
}

function calculateStagePoints(competitorHitFactor, bestHitFactor, stageMaximumPoints) {
  if (bestHitFactor <= 0 || competitorHitFactor <= 0 || stageMaximumPoints <= 0) return 0;
  return d(competitorHitFactor).div(bestHitFactor).mul(stageMaximumPoints).toNumber();
}

function calculateStagePercentage(stagePoints, stageMaximumPoints) {
  if (stageMaximumPoints <= 0) return 0;
  return d(stagePoints).div(stageMaximumPoints).mul(100).toNumber();
}

function calculateMatchPoints(stagePointsList) {
  return stagePointsList.reduce((sum, sp) => d(sum).plus(sp).toNumber(), 0);
}

function calculateMatchPercentage(competitorMatchPoints, divisionBestMatchPoints) {
  if (divisionBestMatchPoints <= 0 || competitorMatchPoints <= 0) return 0;
  return d(competitorMatchPoints).div(divisionBestMatchPoints).mul(100).toNumber();
}

function calculateScore(profile, powerFactor, input) {
  const hitPoints = calculateHitPoints(profile, powerFactor, input);
  const penaltyPoints = calculatePenaltyPoints(profile, input);
  const pointsAfterPenalty = calculatePointsAfterPenalty(hitPoints, penaltyPoints);
  const effectivePoints = calculateEffectivePoints(profile, pointsAfterPenalty);
  const hitFactor = calculateHitFactor(effectivePoints, input.timeSeconds);

  return {
    hitPoints,
    penaltyPoints,
    pointsAfterPenalty,
    effectivePoints,
    hitFactor,
  };
}

function findBestHitFactor(hitFactors) {
  if (!hitFactors.length) return 0;
  return hitFactors.reduce((best, hf) => (hf > best ? hf : best), 0);
}

function calculateStageRanking(scores, stageMaximumPoints) {
  const bestHf = findBestHitFactor(scores.map((s) => s.hitFactor));
  return scores
    .map((s) => {
      const stagePoints = calculateStagePoints(s.hitFactor, bestHf, stageMaximumPoints);
      const stagePercentage = calculateStagePercentage(stagePoints, stageMaximumPoints);
      return { ...s, bestHitFactor: bestHf, stagePoints, stagePercentage };
    })
    .sort((a, b) => b.stagePoints - a.stagePoints || b.hitFactor - a.hitFactor)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function calculateMatchRanking(competitors) {
  const best = findBestHitFactor(competitors.map((c) => c.matchPoints));
  return competitors
    .map((c) => ({
      ...c,
      matchPercentage: calculateMatchPercentage(c.matchPoints, best),
    }))
    .sort((a, b) => b.matchPoints - a.matchPoints || b.matchPercentage - a.matchPercentage)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

module.exports = {
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
  findBestHitFactor,
  calculateStageRanking,
  calculateMatchRanking,
  formatHitFactor,
  resolveHitValues,
};
