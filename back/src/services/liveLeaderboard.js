const { Op } = require('sequelize');
const { Match, Competitor, Score, Stage, MatchResult, MatchDivision, MatchCategory } = require('../models');

function athleteName(competitor) {
  if (!competitor) return '—';
  return `${competitor.firstName || ''} ${competitor.lastName || ''}`.trim() || '—';
}

function competitorInclude() {
  return {
    model: Competitor,
    include: [{ model: MatchDivision }, { model: MatchCategory }],
  };
}

function competitorMeta(competitor) {
  return {
    name: athleteName(competitor),
    bibNumber: competitor?.bibNumber || '',
    division: competitor?.MatchDivision?.code || competitor?.MatchDivision?.name || '',
    category: competitor?.MatchCategory?.code || competitor?.MatchCategory?.name || '',
    status: competitor?.status || 'ACTIVE',
    dq: competitor?.status === 'DQ',
  };
}

function serializeHits(score) {
  return {
    alphaHits: Number(score.alphaHits || 0),
    charlieHits: Number(score.charlieHits || 0),
    deltaHits: Number(score.deltaHits || 0),
    missCount: Number(score.missCount || 0),
    noShootCount: Number(score.noShootCount || 0),
    proceduralCount: Number(score.proceduralCount || 0),
    hitPoints: Number(score.hitPoints || 0),
    penaltyPoints: Number(score.penaltyPoints || 0),
    effectivePoints: Number(score.effectivePoints || 0),
    hitFactor: Number(score.hitFactor || 0),
    timeSeconds: Number(score.timeSeconds || 0),
    status: score.status,
  };
}

async function getLeaderboardForMatch(matchId, competitionId) {
  const [official, scores] = await Promise.all([
    MatchResult.findAll({
      where: { matchId },
      include: [competitorInclude()],
      order: [['rank', 'ASC']],
    }),
    Score.findAll({
      where: { matchId, status: { [Op.in]: ['ENTERED', 'CONFIRMED', 'SIGNED'] } },
      include: [competitorInclude(), { model: Stage }],
      order: [['updatedAt', 'DESC']],
    }),
  ]);

  const byId = new Map();
  for (const score of scores) {
    const id = score.competitorId;
    if (!byId.has(id)) {
      byId.set(id, {
        competitorId: id,
        ...competitorMeta(score.Competitor),
        points: 0,
        percentage: 0,
        stages: 0,
      });
    }
    const row = byId.get(id);
    row.points += Number(score.hitFactor || 0);
    row.stages += 1;
  }
  for (const row of official) {
    const id = row.competitorId;
    if (!byId.has(id)) {
      byId.set(id, {
        competitorId: id,
        ...competitorMeta(row.Competitor),
        points: Number(row.matchPoints || 0),
        percentage: Number(row.matchPercentage || 0),
        stages: 0,
      });
      continue;
    }
    const existing = byId.get(id);
    existing.points = Number(row.matchPoints || existing.points || 0);
    existing.percentage = Number(row.matchPercentage || 0);
  }
  const results = [...byId.values()]
    .sort((a, b) => (b.percentage || b.points) - (a.percentage || a.points))
    .map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

  const latest = scores.slice(0, 20).map((score) => ({
    competitorId: score.competitorId,
    name: athleteName(score.Competitor),
    stageName: score.Stage ? `${score.Stage.number || ''}. ${score.Stage.name || ''}`.trim() : 'Stage',
    at: score.updatedAt,
    ...serializeHits(score),
  }));

  const stagesByCompetitor = new Map();
  for (const score of [...scores].reverse()) {
    const id = score.competitorId;
    if (!stagesByCompetitor.has(id)) stagesByCompetitor.set(id, []);
    stagesByCompetitor.get(id).push({
      stageName: score.Stage ? `${score.Stage.number || ''}. ${score.Stage.name || ''}`.trim() : 'Stage',
      ...serializeHits(score),
    });
  }
  results = results.map((row) => {
    const stages = stagesByCompetitor.get(row.competitorId) || [];
    const totals = stages.reduce(
      (acc, stage) => {
        acc.alphaHits += stage.alphaHits;
        acc.charlieHits += stage.charlieHits;
        acc.deltaHits += stage.deltaHits;
        acc.missCount += stage.missCount;
        acc.noShootCount += stage.noShootCount;
        acc.proceduralCount += stage.proceduralCount;
        acc.hitPoints += stage.hitPoints;
        acc.penaltyPoints += stage.penaltyPoints;
        acc.timeSeconds += stage.timeSeconds;
        return acc;
      },
      { alphaHits: 0, charlieHits: 0, deltaHits: 0, missCount: 0, noShootCount: 0, proceduralCount: 0, hitPoints: 0, penaltyPoints: 0, timeSeconds: 0 }
    );
    return {
      ...row,
      ...totals,
      stageCount: stages.length,
      stages,
    };
  });

  return {
    matchId,
    competitionId: competitionId || null,
    results,
    latest,
    updatedAt: new Date().toISOString(),
  };
}

async function getLeaderboardForCompetition(competitionId) {
  const match = await Match.findOne({ where: { competitionId } });
  if (!match) {
    return {
      matchId: null,
      competitionId,
      results: [],
      latest: [],
      updatedAt: new Date().toISOString(),
    };
  }
  return getLeaderboardForMatch(match.id, competitionId);
}

module.exports = { getLeaderboardForMatch, getLeaderboardForCompetition };
