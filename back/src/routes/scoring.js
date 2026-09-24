const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  Match,
  Competition,
  MatchType,
  Stage,
  Squad,
  Competitor,
  Score,
  StageResult,
  MatchResult,
  MatchDivision,
  MatchCategory,
  ScoreRevision,
  SyncOperation,
  Member,
  sequelize,
} = require('../models');
const { requireAdmin } = require('../middleware/auth');
const { createOrUpdateScore, confirmScore, invalidateScore, MESSAGES } = require('../services/scoreService');
const {
  getSquadCompetitors,
  getSquadQueue,
  getCurrentCompetitor,
  getNextCompetitor,
  ensureCompetitorFromRegistration,
} = require('../services/competitorService');
const {
  recalculateStageDivisionResultsForMatch,
  recalculateMatchDivisionResultsForMatch,
} = require('../services/resultService');
const { calculateStageProgress, calculateMatchProgress } = require('../domain/scoring/result-engine');
const { formatHitFactor } = require('../domain/scoring/scoring-engine');
const { calculateScore } = require('../domain/scoring/scoring-engine');
const { getScoringProfile, PROFILES } = require('../domain/scoring/scoring-profile');

const router = express.Router();

function serializeCompetitor(c) {
  return {
    id: c.id,
    matchId: c.matchId,
    bibNumber: c.bibNumber,
    firstName: c.firstName,
    lastName: c.lastName,
    fullName: `${c.firstName} ${c.lastName}`.trim(),
    divisionId: c.matchDivisionId || c.divisionId,
    categoryId: c.categoryId,
    powerFactor: c.powerFactor,
    squadId: c.squadId,
    status: c.status,
  };
}

function serializeMatch(m) {
  const c = m.Competition;
  const mt = c?.MatchType;
  return {
    id: m.id,
    competitionId: m.competitionId,
    name: m.name,
    title: c?.title || m.name,
    subtitle: c?.subtitle || null,
    discipline: m.discipline || mt?.name || 'IPSC',
    scoringProfileId: m.scoringProfileId,
    status: m.status,
    location: m.location || c?.location || null,
    startDate: m.startDate || c?.eventDate || null,
    endDate: m.endDate || c?.eventEndDate || null,
    organizer: c?.organizer || 'Монголын Практик Буудлагын Холбоо',
    imageUrl: c?.imageUrl || null,
    matchTypeName: mt?.name || null,
  };
}

function serializeScore(s) {
  return {
    id: s.id,
    matchId: s.matchId,
    stageId: s.stageId,
    competitorId: s.competitorId,
    timeSeconds: Number(s.timeSeconds),
    alphaHits: s.alphaHits,
    charlieHits: s.charlieHits,
    deltaHits: s.deltaHits,
    missCount: s.missCount,
    noShootCount: s.noShootCount,
    proceduralCount: s.proceduralCount,
    otherPenaltyPoints: s.otherPenaltyPoints,
    hitPoints: s.hitPoints,
    penaltyPoints: s.penaltyPoints,
    pointsAfterPenalty: s.pointsAfterPenalty,
    effectivePoints: s.effectivePoints,
    hitFactor: Number(s.hitFactor),
    hitFactorDisplay: formatHitFactor(Number(s.hitFactor)),
    status: s.status,
    version: s.version,
    signedAt: s.signedAt,
  };
}

router.use(requireAdmin);

router.get('/matches', async (_req, res) => {
  const matches = await Match.findAll({
    order: [['startDate', 'DESC']],
    include: [{ model: Competition, include: [MatchType] }],
  });
  res.json({ matches: matches.map(serializeMatch) });
});

router.get('/matches/:matchId', async (req, res) => {
  const match = await Match.findByPk(req.params.matchId, {
    include: [
      { model: Competition, include: [MatchType] },
      Stage,
      Squad,
      MatchDivision,
      MatchCategory,
    ],
  });
  if (!match) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  res.json({ match: { ...serializeMatch(match), Stages: match.Stages, Squads: match.Squads } });
});

router.get('/matches/:matchId/squads', async (req, res) => {
  const matchId = req.params.matchId;
  const squads = await Squad.findAll({ where: { matchId }, order: [['startTime', 'ASC'], ['name', 'ASC']] });
  const competitors = await Competitor.findAll({ where: { matchId, status: 'ACTIVE' } });
  const bySquad = {};
  for (const c of competitors) {
    if (!c.squadId) continue;
    bySquad[c.squadId] = (bySquad[c.squadId] || 0) + 1;
  }
  const eligible = competitors.length || 1;
  const activeStage = await Stage.findOne({ where: { matchId, status: 'ACTIVE' } });
  let signedBySquad = {};
  if (activeStage) {
    const signed = await Score.findAll({
      where: { matchId, stageId: activeStage.id, status: 'SIGNED' },
      attributes: ['competitorId'],
    });
    const signedIds = new Set(signed.map((s) => s.competitorId));
    for (const c of competitors) {
      if (c.squadId && signedIds.has(c.id)) {
        signedBySquad[c.squadId] = (signedBySquad[c.squadId] || 0) + 1;
      }
    }
  }
  res.json({
    squads: squads.map((s) => {
      const filled = bySquad[s.id] || 0;
      const done = signedBySquad[s.id] || 0;
      const progress = filled > 0 ? (done / filled) * 100 : 0;
      let statusLabel = 'Хүлээгдэж байна';
      if (progress >= 100) statusLabel = 'Дууссан';
      else if (progress > 0) statusLabel = 'Явж байгаа';
      else if (s.status === 'ACTIVE') statusLabel = 'Явж байгаа';
      return {
        id: s.id,
        name: s.name,
        capacity: s.capacity,
        filled,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status,
        statusLabel,
        progress,
      };
    }),
  });
});

router.get('/matches/:matchId/competitors', async (req, res) => {
  const competitors = await Competitor.findAll({
    where: { matchId: req.params.matchId },
    order: [['bibNumber', 'ASC']],
  });
  res.json({ competitors: competitors.map(serializeCompetitor) });
});

router.get('/matches/:matchId/stages', async (req, res) => {
  const stages = await Stage.findAll({
    where: { matchId: req.params.matchId },
    order: [['number', 'ASC']],
  });
  res.json({ stages });
});

router.get('/squads/:squadId/queue', async (req, res) => {
  const { stageId } = req.query;
  if (!stageId) return res.status(400).json({ message: MESSAGES.SCORE_INCOMPLETE });
  const queue = await getSquadQueue(req.params.squadId, stageId);
  const current = await getCurrentCompetitor(req.params.squadId, stageId);
  res.json({
    queue: queue.map(serializeCompetitor),
    current: current ? serializeCompetitor(current) : null,
  });
});

router.get('/squads/:squadId/next', async (req, res) => {
  const { stageId, currentCompetitorId } = req.query;
  const next = await getNextCompetitor(req.params.squadId, stageId, currentCompetitorId);
  res.json({ next: next ? serializeCompetitor(next) : null });
});

router.post('/scores/preview', async (req, res) => {
  const { matchId, competitorId, ...input } = req.body || {};
  const match = await Match.findByPk(matchId);
  const competitor = await Competitor.findByPk(competitorId);
  if (!match || !competitor) {
    return res.status(404).json({ message: MESSAGES.COMPETITOR_NOT_FOUND });
  }
  const profile = getScoringProfile(match.scoringProfileId) || PROFILES.IPSC_ACTION_AIR;
  const calc = calculateScore(profile, competitor.powerFactor, input);
  res.json({
    ...calc,
    hitFactorDisplay: formatHitFactor(calc.hitFactor),
  });
});

router.post('/scores', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || null;
    const score = await createOrUpdateScore(req.body, req.admin.id, deviceId);
    res.json({ score: serializeScore(score) });
  } catch (e) {
    if (e.code === 'VERSION_CONFLICT') {
      return res.status(409).json({
        message: MESSAGES.VERSION_CONFLICT,
        serverScore: serializeScore(e.serverScore),
      });
    }
    return res.status(400).json({ message: e.message });
  }
});

router.post('/scores/:scoreId/confirm', async (req, res) => {
  try {
    const { pin, competitorId } = req.body || {};
    const deviceId = req.headers['x-device-id'] || null;
    const score = await confirmScore(req.params.scoreId, pin, competitorId, req.admin.id, deviceId);
    res.json({ score: serializeScore(score) });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.post('/scores/:scoreId/invalidate', async (req, res) => {
  try {
    const deviceId = req.headers['x-device-id'] || null;
    const score = await invalidateScore(req.params.scoreId, req.admin.id, req.body?.reason, deviceId);
    res.json({ score: serializeScore(score) });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

router.get('/scores/:scoreId/revisions', async (req, res) => {
  const revisions = await ScoreRevision.findAll({
    where: { scoreId: req.params.scoreId },
    order: [['revisionNumber', 'ASC']],
  });
  res.json({ revisions });
});

router.get('/matches/:matchId/results/live', async (req, res) => {
  const { divisionId, categoryId, squadId, stageId } = req.query;
  const matchId = req.params.matchId;

  if (stageId) {
    const where = { matchId, stageId };
    if (divisionId) where.divisionId = divisionId;
    const results = await StageResult.findAll({
      where,
      include: [{ model: Competitor }],
      order: [['rank', 'ASC']],
    });
    let rows = results;
    if (categoryId) rows = rows.filter((r) => r.Competitor?.categoryId === categoryId);
    if (squadId) rows = rows.filter((r) => r.Competitor?.squadId === squadId);
    return res.json({
      type: 'stage',
      results: rows.map((r) => ({
        rank: r.rank,
        athlete: serializeCompetitor(r.Competitor),
        hitFactor: Number(r.hitFactor),
        stagePoints: Number(r.stagePoints),
        stagePercentage: Number(r.stagePercentage),
        dq: r.Competitor?.status === 'DQ',
      })),
    });
  }

  const where = { matchId };
  if (divisionId) where.divisionId = divisionId;
  const results = await MatchResult.findAll({
    where,
    include: [{ model: Competitor }],
    order: [['rank', 'ASC']],
  });
  let rows = results;
  if (categoryId) rows = rows.filter((r) => r.Competitor?.categoryId === categoryId);
  if (squadId) rows = rows.filter((r) => r.Competitor?.squadId === squadId);

  res.json({
    type: 'match',
    results: rows.map((r) => ({
      rank: r.rank,
      athlete: serializeCompetitor(r.Competitor),
      points: Number(r.matchPoints),
      percentage: Number(r.matchPercentage),
      dq: r.Competitor?.status === 'DQ',
    })),
  });
});

router.get('/matches/:matchId/progress', async (req, res) => {
  const matchId = req.params.matchId;
  const eligibleCompetitors = await Competitor.count({
    where: { matchId, status: 'ACTIVE' },
  });
  const activeStages = await Stage.count({ where: { matchId } });
  const signedScores = await Score.count({ where: { matchId, status: 'SIGNED' } });
  const matchProgress = calculateMatchProgress(signedScores, eligibleCompetitors, activeStages);

  const stages = await Stage.findAll({ where: { matchId } });
  const stageProgress = [];
  let completedStages = 0;
  let activeStagesCount = 0;
  for (const stage of stages) {
    const completed = await Score.count({ where: { matchId, stageId: stage.id, status: 'SIGNED' } });
    const progress = calculateStageProgress(completed, eligibleCompetitors);
    if (progress >= 100) completedStages += 1;
    else if (progress > 0) activeStagesCount += 1;
    stageProgress.push({
      stageId: stage.id,
      number: stage.number,
      name: stage.name,
      courseType: stage.courseType,
      maximumPoints: stage.maximumPoints,
      minimumRounds: stage.minimumRounds,
      progress,
      status: progress >= 100 ? 'COMPLETED' : progress > 0 ? 'ACTIVE' : 'WAITING',
    });
  }

  res.json({
    matchProgress,
    stageProgress,
    signedScores,
    expectedScores: eligibleCompetitors * activeStages,
    stats: {
      competitors: eligibleCompetitors,
      stages: activeStages,
      squads: await Squad.count({ where: { matchId } }),
      completedStages,
      activeStages: activeStagesCount,
      remainingStages: Math.max(0, stages.length - completedStages - activeStagesCount),
    },
  });
});

router.post('/sync', async (req, res) => {
  const operations = Array.isArray(req.body?.operations) ? req.body.operations : [];
  const deviceId = req.headers['x-device-id'] || req.body?.deviceId || null;
  const results = [];

  for (const op of operations) {
    try {
      if (op.action === 'create_score' || op.action === 'update_score') {
        const score = await createOrUpdateScore(
          { ...op.payload, expectedVersion: op.payload.expectedVersion },
          req.admin.id,
          deviceId
        );
        results.push({ id: op.id, status: 'SYNCED', scoreId: score.id, version: score.version });
      } else if (op.action === 'confirm_score') {
        const score = await confirmScore(
          op.payload.scoreId,
          op.payload.pin,
          op.payload.competitorId,
          req.admin.id,
          deviceId
        );
        results.push({ id: op.id, status: 'SYNCED', scoreId: score.id });
      } else {
        results.push({ id: op.id, status: 'FAILED', message: MESSAGES.SYNC_FAILED });
      }
    } catch (e) {
      const status = e.code === 'VERSION_CONFLICT' ? 'CONFLICT' : 'FAILED';
      results.push({ id: op.id, status, message: e.message });
      await SyncOperation.create({
        entityType: op.entityType || 'Score',
        entityId: op.entityId || null,
        action: op.action,
        payload: op.payload,
        syncStatus: status,
        deviceId,
        errorMessage: e.message,
      });
    }
  }

  res.json({ results });
});

router.post('/registrations/:registrationId/import', async (req, res) => {
  const competitor = await ensureCompetitorFromRegistration(req.params.registrationId, {
    actorId: req.admin.id,
    powerFactor: req.body?.powerFactor,
  });
  if (!competitor) return res.status(404).json({ message: 'Бүртгэл олдсонгүй эсвэл төлбөр баталгаажаагүй.' });
  res.json({ competitor: serializeCompetitor(competitor) });
});

module.exports = router;
