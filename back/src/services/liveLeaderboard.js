const { Op } = require('sequelize');
const { Match, Competitor, Score, Stage, MatchResult } = require('../models');

function athleteName(competitor) {
  if (!competitor) return '—';
  return `${competitor.firstName || ''} ${competitor.lastName || ''}`.trim() || '—';
}

async function getLeaderboardForMatch(matchId, competitionId) {
  const [official, scores] = await Promise.all([
    MatchResult.findAll({
      where: { matchId },
      include: [{ model: Competitor }],
      order: [['rank', 'ASC']],
    }),
    Score.findAll({
      where: { matchId, status: { [Op.in]: ['ENTERED', 'CONFIRMED', 'SIGNED'] } },
      include: [{ model: Competitor }, { model: Stage }],
      order: [['updatedAt', 'DESC']],
    }),
  ]);

  let results;
  if (official.length) {
    results = official.map((row) => ({
      rank: row.rank,
      competitorId: row.competitorId,
      name: athleteName(row.Competitor),
      bibNumber: row.Competitor?.bibNumber || '',
      points: Number(row.matchPoints || 0),
      percentage: Number(row.matchPercentage || 0),
      status: row.Competitor?.status || 'ACTIVE',
      dq: row.Competitor?.status === 'DQ',
    }));
  } else {
    const totals = new Map();
    for (const score of scores) {
      const id = score.competitorId;
      if (!totals.has(id)) {
        totals.set(id, {
          competitorId: id,
          name: athleteName(score.Competitor),
          bibNumber: score.Competitor?.bibNumber || '',
          points: 0,
          stages: 0,
          status: score.Competitor?.status || 'ACTIVE',
          dq: score.Competitor?.status === 'DQ',
        });
      }
      const row = totals.get(id);
      row.points += Number(score.hitFactor || 0);
      row.stages += 1;
    }
    results = [...totals.values()]
      .sort((a, b) => b.points - a.points)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        percentage: 0,
      }));
  }

  const latest = scores.slice(0, 20).map((score) => ({
    competitorId: score.competitorId,
    name: athleteName(score.Competitor),
    stageName: score.Stage ? `${score.Stage.number || ''}. ${score.Stage.name || ''}`.trim() : 'Stage',
    hitFactor: Number(score.hitFactor || 0),
    timeSeconds: Number(score.timeSeconds || 0),
    status: score.status,
    at: score.updatedAt,
  }));

  const stagesByCompetitor = new Map();
  for (const score of [...scores].reverse()) {
    const id = score.competitorId;
    if (!stagesByCompetitor.has(id)) stagesByCompetitor.set(id, []);
    stagesByCompetitor.get(id).push({
      stageName: score.Stage ? `${score.Stage.number || ''}. ${score.Stage.name || ''}`.trim() : 'Stage',
      hitFactor: Number(score.hitFactor || 0),
      timeSeconds: Number(score.timeSeconds || 0),
      status: score.status,
    });
  }
  results = results.map((row) => ({
    ...row,
    stages: stagesByCompetitor.get(row.competitorId) || [],
  }));

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
