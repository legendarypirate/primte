const { Op } = require('sequelize');
const {
  Score,
  StageResult,
  MatchResult,
  Stage,
  Competitor,
  Match,
  ScoringProfile,
} = require('../models');
const { recalculateStageDivisionResults, recalculateMatchDivisionResults } = require('../domain/scoring/result-engine');
const { getScoringProfile, PROFILES } = require('../domain/scoring/scoring-profile');
const { COMPETITOR_STATUS } = require('../domain/scoring/scoring-types');

function excluding(ids) {
  return ids.length ? { [Op.notIn]: ids } : { [Op.ne]: null };
}

async function loadProfile(match) {
  const row = await ScoringProfile.findByPk(match.scoringProfileId);
  if (row) return row.toJSON();
  return getScoringProfile(match.scoringProfileId) || PROFILES.IPSC_ACTION_AIR;
}

async function recalculateStageDivisionResultsForMatch(matchId, stageId, divisionId) {
  const stage = await Stage.findByPk(stageId);
  if (!stage || stage.matchId !== matchId) return [];

  const scores = await Score.findAll({
    where: { matchId, stageId, status: 'SIGNED' },
    include: [{ model: Competitor, attributes: ['id', 'divisionId', 'matchDivisionId', 'status'] }],
  });

  const payload = scores.map((s) => ({
    scoreId: s.id,
    competitorId: s.competitorId,
    divisionId: s.Competitor?.matchDivisionId || s.Competitor?.divisionId || divisionId,
    hitFactor: Number(s.hitFactor),
    competitorStatus: s.Competitor?.status || COMPETITOR_STATUS.ACTIVE,
    status: s.status,
  }));

  const filtered = divisionId
    ? payload.filter((p) => p.divisionId === divisionId)
    : payload;

  const ranked = recalculateStageDivisionResults(filtered, stage.maximumPoints, divisionId || 'all');

  if (divisionId) {
    await StageResult.destroy({
      where: {
        matchId,
        stageId,
        divisionId,
        competitorId: excluding(ranked.map((r) => r.competitorId)),
      },
    });
  }

  for (const row of ranked) {
    await StageResult.upsert({
      matchId,
      stageId,
      competitorId: row.competitorId,
      divisionId: row.divisionId,
      hitFactor: row.hitFactor,
      bestHitFactor: row.bestHitFactor,
      stagePoints: row.stagePoints,
      stagePercentage: row.stagePercentage,
      rank: row.rank,
    });
  }

  return ranked;
}

async function recalculateMatchDivisionResultsForMatch(matchId, divisionId) {
  const stageResults = await StageResult.findAll({
    where: { matchId, ...(divisionId ? { divisionId } : {}) },
    include: [{ model: Competitor, attributes: ['id', 'status', 'matchDivisionId', 'divisionId'] }],
  });

  const byCompetitor = {};
  for (const sr of stageResults) {
    if (!byCompetitor[sr.competitorId]) {
      byCompetitor[sr.competitorId] = [];
    }
    byCompetitor[sr.competitorId].push({
      stagePoints: Number(sr.stagePoints),
      divisionId: sr.divisionId,
      competitorStatus: sr.Competitor?.status,
    });
  }

  const ranked = recalculateMatchDivisionResults(byCompetitor);

  if (divisionId) {
    await MatchResult.destroy({
      where: {
        matchId,
        divisionId,
        competitorId: excluding(ranked.map((r) => r.competitorId)),
      },
    });
  }

  for (const row of ranked) {
    await MatchResult.upsert({
      matchId,
      competitorId: row.competitorId,
      divisionId: row.divisionId,
      matchPoints: row.matchPoints,
      matchPercentage: row.matchPercentage,
      rank: row.rank,
    });
  }

  return ranked;
}

async function recalculateWholeMatch(matchId) {
  const [stages, competitors] = await Promise.all([
    Stage.findAll({ where: { matchId }, attributes: ['id'] }),
    Competitor.findAll({ where: { matchId }, attributes: ['matchDivisionId', 'divisionId'] }),
  ]);
  const divisions = [...new Set(competitors.map((c) => c.matchDivisionId || c.divisionId).filter(Boolean))];
  await StageResult.destroy({ where: { matchId, divisionId: excluding(divisions) } });
  await MatchResult.destroy({ where: { matchId, divisionId: excluding(divisions) } });
  for (const div of divisions) {
    for (const stage of stages) {
      await recalculateStageDivisionResultsForMatch(matchId, stage.id, div);
    }
    await recalculateMatchDivisionResultsForMatch(matchId, div);
  }
}

async function recalculateAfterScore(matchId, stageId, divisionId) {
  const divisions = divisionId
    ? [divisionId]
    : [...new Set((await Competitor.findAll({ where: { matchId }, attributes: ['matchDivisionId', 'divisionId'] })).map((c) => c.matchDivisionId || c.divisionId).filter(Boolean))];

  for (const div of divisions) {
    await recalculateStageDivisionResultsForMatch(matchId, stageId, div);
    await recalculateMatchDivisionResultsForMatch(matchId, div);
  }
}

module.exports = {
  recalculateStageDivisionResultsForMatch,
  recalculateMatchDivisionResultsForMatch,
  recalculateAfterScore,
  recalculateWholeMatch,
  loadProfile,
};
