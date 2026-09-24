const {
  calculateStagePoints,
  calculateStagePercentage,
  calculateMatchPoints,
  calculateMatchPercentage,
  findBestHitFactor,
  calculateStageRanking,
  calculateMatchRanking,
} = require('./scoring-engine');
const { COMPETITOR_STATUS } = require('./scoring-types');

function recalculateStageDivisionResults(scores, stageMaximumPoints, divisionId) {
  const eligible = scores.filter(
    (s) =>
      s.divisionId === divisionId &&
      s.competitorStatus !== COMPETITOR_STATUS.DQ &&
      s.competitorStatus !== COMPETITOR_STATUS.WITHDRAWN &&
      s.status === 'SIGNED'
  );
  return calculateStageRanking(eligible, stageMaximumPoints);
}

function recalculateMatchDivisionResults(stageResultsByCompetitor) {
  const rows = Object.entries(stageResultsByCompetitor).map(([competitorId, stageResults]) => ({
    competitorId,
    divisionId: stageResults[0]?.divisionId,
    competitorStatus: stageResults[0]?.competitorStatus,
    matchPoints: calculateMatchPoints(stageResults.map((sr) => sr.stagePoints)),
    stageResults,
  }));
  const eligible = rows.filter(
    (r) =>
      r.competitorStatus !== COMPETITOR_STATUS.DQ &&
      r.competitorStatus !== COMPETITOR_STATUS.WITHDRAWN
  );
  return calculateMatchRanking(eligible);
}

function calculateStageProgress(completedAthletes, eligibleAthletes) {
  if (eligibleAthletes <= 0) return 0;
  return (completedAthletes / eligibleAthletes) * 100;
}

function calculateStageStatus(progress) {
  if (progress <= 0) return 'WAITING';
  if (progress >= 100) return 'COMPLETED';
  return 'ACTIVE';
}

function calculateMatchProgress(signedScores, eligibleCompetitors, activeStages) {
  const expected = eligibleCompetitors * activeStages;
  if (expected <= 0) return 0;
  return (signedScores / expected) * 100;
}

module.exports = {
  recalculateStageDivisionResults,
  recalculateMatchDivisionResults,
  calculateStageProgress,
  calculateStageStatus,
  calculateMatchProgress,
  calculateStagePoints,
  calculateStagePercentage,
  calculateMatchPoints,
  calculateMatchPercentage,
  findBestHitFactor,
};
