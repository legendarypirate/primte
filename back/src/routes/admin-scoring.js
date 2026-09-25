const express = require('express');
const { Op } = require('sequelize');
const {
  Admin,
  Competition,
  Competitor,
  Match,
  MatchDivision,
  MatchResult,
  Member,
  Registration,
  Score,
  ScoreRevision,
  Squad,
  Stage,
  StageResult,
} = require('../models');
const AuditLog = require('../models/auditLog');
const { requireAdmin, hasPermission } = require('../middleware/auth');
const { invalidateScore } = require('../services/scoreService');
const { recalculateAfterScore, recalculateWholeMatch } = require('../services/resultService');
const { ensureCompetitorFromRegistration, ensureMatchForCompetition } = require('../services/competitorService');
const { MATCH_STATUS } = require('../domain/scoring/scoring-types');

const router = express.Router();
router.use(requireAdmin);

const SCORE_STATUSES = ['DRAFT', 'ENTERED', 'CONFIRMED', 'SIGNED', 'INVALIDATED'];
const STATUS_PRIORITY = { SIGNED: 5, CONFIRMED: 4, ENTERED: 3, DRAFT: 2, INVALIDATED: 1 };
const COURSE_TYPES = ['SHORT', 'MEDIUM', 'LONG', 'CUSTOM'];
const STAGE_STATUSES = ['WAITING', 'ACTIVE', 'COMPLETED'];
const COMPETITOR_STATUSES = ['ACTIVE', 'WITHDRAWN', 'DQ'];
const POWER_FACTORS = ['MAJOR', 'MINOR', 'NONE'];

function requireAny(...keys) {
  return (req, res, next) => {
    if (keys.some((key) => hasPermission(req.admin, key))) return next();
    return res.status(403).json({ message: 'Энэ үйлдэл хийх эрхгүй.' });
  };
}

const canView = requireAny('scoring.view', 'competitions.view');
const canManage = requireAny('scoring.manage', 'competitions.manage');

const num = (value) => Number(value || 0);
const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);

function competitorName(c) {
  return `${c?.firstName || ''} ${c?.lastName || ''}`.trim() || 'Нэргүй';
}

async function adminNames(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return {};
  const admins = await Admin.findAll({ where: { id: unique }, attributes: ['id', 'name'] });
  return Object.fromEntries(admins.map((a) => [a.id, a.name]));
}

function person(id, names) {
  return id ? { id, name: names[id] || 'Тодорхойгүй' } : null;
}

async function loadMatchContext(competitionId) {
  const competition = await Competition.findByPk(competitionId);
  if (!competition) return { competition: null };
  const match = await Match.findOne({ where: { competitionId } });
  if (!match) return { competition, match: null };
  const [stages, divisions, squads, competitors] = await Promise.all([
    Stage.findAll({ where: { matchId: match.id }, order: [['number', 'ASC']] }),
    MatchDivision.findAll({ where: { matchId: match.id }, order: [['name', 'ASC']] }),
    Squad.findAll({ where: { matchId: match.id }, order: [['name', 'ASC']] }),
    Competitor.findAll({
      where: { matchId: match.id },
      include: [{ model: Member, attributes: ['id', 'memberCode', 'avatarUrl'] }],
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    }),
  ]);
  return { competition, match, stages, divisions, squads, competitors };
}

function lookups(ctx) {
  return {
    stageById: Object.fromEntries(ctx.stages.map((s) => [s.id, s])),
    divisionById: Object.fromEntries(ctx.divisions.map((d) => [d.id, d])),
    squadById: Object.fromEntries(ctx.squads.map((s) => [s.id, s])),
    competitorById: Object.fromEntries(ctx.competitors.map((c) => [c.id, c])),
  };
}

function serializeMatch(match) {
  return {
    id: match.id,
    name: match.name,
    status: match.status,
    discipline: match.discipline,
    scoringProfileId: match.scoringProfileId,
    startDate: match.startDate,
    endDate: match.endDate,
    location: match.location,
  };
}

function serializeStage(stage) {
  return {
    id: stage.id,
    number: stage.number,
    name: stage.name,
    courseType: stage.courseType,
    minimumRounds: stage.minimumRounds,
    maximumPoints: stage.maximumPoints,
    paperTargetCount: stage.paperTargetCount,
    metalTargetCount: stage.metalTargetCount,
    noShootCount: stage.noShootCount,
    status: stage.status,
  };
}

function serializeCompetitor(c, maps) {
  const division = maps.divisionById[c.matchDivisionId];
  const squad = maps.squadById[c.squadId];
  return {
    id: c.id,
    name: competitorName(c),
    firstName: c.firstName,
    lastName: c.lastName,
    bibNumber: c.bibNumber,
    memberId: c.memberId,
    memberCode: c.Member?.memberCode || null,
    avatarUrl: c.Member?.avatarUrl || null,
    status: c.status,
    powerFactor: c.powerFactor,
    divisionId: c.matchDivisionId,
    divisionName: division ? division.code || division.name : null,
    squadId: c.squadId,
    squadName: squad?.name || null,
  };
}

function serializeScore(score, maps, names) {
  const stage = maps.stageById[score.stageId];
  const competitor = maps.competitorById[score.competitorId];
  return {
    id: score.id,
    status: score.status,
    stageId: score.stageId,
    stageNumber: stage?.number ?? null,
    stageName: stage?.name ?? null,
    competitor: competitor ? serializeCompetitor(competitor, maps) : null,
    alphaHits: score.alphaHits,
    charlieHits: score.charlieHits,
    deltaHits: score.deltaHits,
    missCount: score.missCount,
    noShootCount: score.noShootCount,
    proceduralCount: score.proceduralCount,
    otherPenaltyPoints: score.otherPenaltyPoints,
    timeSeconds: num(score.timeSeconds),
    hitPoints: score.hitPoints,
    penaltyPoints: score.penaltyPoints,
    pointsAfterPenalty: score.pointsAfterPenalty,
    effectivePoints: score.effectivePoints,
    hitFactor: num(score.hitFactor),
    enteredBy: person(score.enteredBy, names),
    signedBy: person(score.signedBy, names),
    signedAt: score.signedAt,
    deviceId: score.deviceId,
    version: score.version,
    createdAt: score.createdAt,
    updatedAt: score.updatedAt,
  };
}

function bestScoresByPair(scores) {
  const best = {};
  for (const s of scores) {
    const key = `${s.competitorId}:${s.stageId}`;
    const current = best[key];
    if (
      !current ||
      STATUS_PRIORITY[s.status] > STATUS_PRIORITY[current.status] ||
      (STATUS_PRIORITY[s.status] === STATUS_PRIORITY[current.status] && s.updatedAt > current.updatedAt)
    ) {
      best[key] = s;
    }
  }
  return best;
}

function describeAction(action) {
  const map = {
    'score.created': 'Оноо оруулсан',
    'score.updated': 'Оноо зассан',
    'score.signed': 'Тамирчин баталгаажуулсан',
    'score.signed_by_admin': 'Админ баталгаажуулсан',
    'score.invalidated': 'Оноо хүчингүй болгосон',
    'competitor.created_from_registration': 'Бүртгэлээс оролцогч нэмсэн',
    'competitor.updated': 'Оролцогч зассан',
    'match.status_changed': 'Тэмцээний төлөв өөрчилсөн',
    'stage.updated': 'Стейж зассан',
    'stage.created': 'Стейж нэмсэн',
    'stage.deleted': 'Стейж устгасан',
    'match.recalculated': 'Үр дүн дахин тооцсон',
  };
  return map[action] || action;
}

async function audit(req, action, entityType, entityId, before, after) {
  await AuditLog.create({
    actorId: req.admin.id,
    action,
    entityType,
    entityId,
    before: before || null,
    after: after || null,
    deviceId: 'admin-web',
  });
}

async function importRegistrations(competition, actorId) {
  const registrations = await Registration.findAll({
    where: { competitionId: competition.id, status: { [Op.in]: ['paid', 'confirmed'] } },
    attributes: ['id'],
  });
  const existing = new Set(
    (await Competitor.findAll({ where: { registrationId: registrations.map((r) => r.id) }, attributes: ['registrationId'] })).map(
      (c) => c.registrationId
    )
  );
  let imported = 0;
  const failed = [];
  for (const reg of registrations) {
    if (existing.has(reg.id)) continue;
    try {
      const competitor = await ensureCompetitorFromRegistration(reg.id, { actorId });
      if (competitor) imported += 1;
    } catch (err) {
      failed.push({ registrationId: reg.id, message: err.message });
    }
  }
  return { imported, failed, eligible: registrations.length };
}

// ---------- Overview ----------

router.get('/competitions/:id/scoring', canView, async (req, res) => {
  const ctx = await loadMatchContext(req.params.id);
  if (!ctx.competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });

  const eligibleRegs = await Registration.count({
    where: { competitionId: ctx.competition.id, status: { [Op.in]: ['paid', 'confirmed'] } },
  });

  const competitionInfo = {
    id: ctx.competition.id,
    title: ctx.competition.title,
    eventDate: ctx.competition.eventDate,
    location: ctx.competition.location,
    status: ctx.competition.status,
  };

  if (!ctx.match) {
    return res.json({
      competition: competitionInfo,
      match: null,
      registrations: { eligible: eligibleRegs, imported: 0, pending: eligibleRegs },
    });
  }

  const maps = lookups(ctx);
  const scores = await Score.findAll({ where: { matchId: ctx.match.id } });
  const best = bestScoresByPair(scores);
  const active = ctx.competitors.filter((c) => c.status === 'ACTIVE');
  const activeIds = new Set(active.map((c) => c.id));

  const statusCounts = Object.fromEntries(SCORE_STATUSES.map((s) => [s, 0]));
  for (const s of scores) statusCounts[s.status] = (statusCounts[s.status] || 0) + 1;

  const signedPairs = Object.values(best).filter((s) => s.status === 'SIGNED' && activeIds.has(s.competitorId));
  const pendingPairs = Object.values(best).filter(
    (s) => ['ENTERED', 'CONFIRMED', 'DRAFT'].includes(s.status) && activeIds.has(s.competitorId)
  );
  const expected = active.length * ctx.stages.length;

  const stages = ctx.stages.map((stage) => {
    const signed = signedPairs.filter((s) => s.stageId === stage.id).length;
    const pending = pendingPairs.filter((s) => s.stageId === stage.id).length;
    const invalidated = scores.filter((s) => s.stageId === stage.id && s.status === 'INVALIDATED').length;
    const stageScores = signedPairs.filter((s) => s.stageId === stage.id);
    const topHf = stageScores.reduce((max, s) => Math.max(max, num(s.hitFactor)), 0);
    return {
      ...serializeStage(stage),
      signed,
      pending,
      invalidated,
      expected: active.length,
      progress: pct(signed, active.length),
      topHitFactor: topHf,
    };
  });

  const squads = ctx.squads.map((squad) => {
    const members = active.filter((c) => c.squadId === squad.id);
    const ids = new Set(members.map((c) => c.id));
    const signed = signedPairs.filter((s) => ids.has(s.competitorId)).length;
    const exp = members.length * ctx.stages.length;
    return {
      id: squad.id,
      name: squad.name,
      status: squad.status,
      competitors: members.length,
      signed,
      expected: exp,
      progress: pct(signed, exp),
    };
  });

  const matchResults = await MatchResult.findAll({ where: { matchId: ctx.match.id, rank: 1 } });
  const divisions = ctx.divisions.map((d) => {
    const members = ctx.competitors.filter((c) => c.matchDivisionId === d.id);
    const leaderRow = matchResults.find((r) => r.divisionId === d.id && activeIds.has(r.competitorId));
    const leader = leaderRow ? maps.competitorById[leaderRow.competitorId] : null;
    return {
      id: d.id,
      name: d.name,
      code: d.code,
      competitors: members.length,
      active: members.filter((c) => c.status === 'ACTIVE').length,
      leader: leader
        ? { competitorId: leader.id, name: competitorName(leader), matchPoints: num(leaderRow.matchPoints) }
        : null,
    };
  });

  const entityIds = [ctx.match.id, ...scores.map((s) => s.id), ...ctx.competitors.map((c) => c.id), ...ctx.stages.map((s) => s.id)];
  const logs = await AuditLog.findAll({
    where: { entityId: entityIds },
    order: [['createdAt', 'DESC']],
    limit: 40,
  });
  const names = await adminNames(logs.map((l) => l.actorId));
  const scoreById = Object.fromEntries(scores.map((s) => [s.id, s]));
  const activity = logs.map((log) => {
    let subject = null;
    if (log.entityType === 'Score') {
      const s = scoreById[log.entityId];
      const c = s && maps.competitorById[s.competitorId];
      const st = s && maps.stageById[s.stageId];
      subject = [c && competitorName(c), st && `Стейж ${st.number}`].filter(Boolean).join(' · ');
    } else if (log.entityType === 'Competitor') {
      const c = maps.competitorById[log.entityId];
      subject = c ? competitorName(c) : null;
    } else if (log.entityType === 'Stage') {
      const st = maps.stageById[log.entityId];
      subject = st ? `Стейж ${st.number} · ${st.name}` : null;
    }
    return {
      id: log.id,
      action: log.action,
      label: describeAction(log.action),
      entityType: log.entityType,
      entityId: log.entityId,
      subject,
      reason: log.after?.reason || null,
      actor: log.actorId ? { id: log.actorId, name: names[log.actorId] || 'Тамирчин / төхөөрөмж' } : null,
      deviceId: log.deviceId,
      createdAt: log.createdAt,
    };
  });

  return res.json({
    competition: competitionInfo,
    match: serializeMatch(ctx.match),
    registrations: {
      eligible: eligibleRegs,
      imported: ctx.competitors.length,
      pending: Math.max(0, eligibleRegs - ctx.competitors.filter((c) => c.registrationId).length),
    },
    stats: {
      competitors: {
        total: ctx.competitors.length,
        active: active.length,
        dq: ctx.competitors.filter((c) => c.status === 'DQ').length,
        withdrawn: ctx.competitors.filter((c) => c.status === 'WITHDRAWN').length,
      },
      scores: statusCounts,
      signed: signedPairs.length,
      pending: pendingPairs.length,
      expected,
      progress: pct(signedPairs.length, expected),
    },
    stages,
    squads,
    divisions,
    activity,
  });
});

// ---------- Setup / import ----------

router.post('/competitions/:id/scoring/setup', canManage, async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  const match = await ensureMatchForCompetition(competition);
  const result = await importRegistrations(competition, req.admin.id);
  return res.json({ matchId: match.id, ...result });
});

router.post('/competitions/:id/scoring/import', canManage, async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  const result = await importRegistrations(competition, req.admin.id);
  return res.json(result);
});

router.post('/competitions/:id/scoring/recalculate', canManage, async (req, res) => {
  const match = await Match.findOne({ where: { competitionId: req.params.id } });
  if (!match) return res.status(404).json({ message: 'Оноо тооцох тэмцээн үүсээгүй байна.' });
  await recalculateWholeMatch(match.id);
  await audit(req, 'match.recalculated', 'Match', match.id);
  return res.json({ ok: true });
});

// ---------- Scores ----------

router.get('/competitions/:id/scoring/scores', canView, async (req, res) => {
  const ctx = await loadMatchContext(req.params.id);
  if (!ctx.competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (!ctx.match) return res.json({ scores: [], filters: { stages: [], divisions: [], squads: [] } });
  const maps = lookups(ctx);

  const where = { matchId: ctx.match.id };
  const { stageId, divisionId, squadId, status, q } = req.query;
  if (stageId) where.stageId = stageId;
  if (status && status !== 'ALL') {
    const list = String(status).split(',').filter((s) => SCORE_STATUSES.includes(s));
    if (list.length) where.status = list;
  }

  let competitorFilter = ctx.competitors;
  if (divisionId) competitorFilter = competitorFilter.filter((c) => c.matchDivisionId === divisionId);
  if (squadId) competitorFilter = competitorFilter.filter((c) => c.squadId === squadId);
  if (q) {
    const needle = String(q).trim().toLowerCase();
    competitorFilter = competitorFilter.filter((c) =>
      [competitorName(c), c.bibNumber, c.Member?.memberCode].filter(Boolean).some((v) => String(v).toLowerCase().includes(needle))
    );
  }
  if (divisionId || squadId || q) where.competitorId = competitorFilter.map((c) => c.id);

  const scores = await Score.findAll({ where, order: [['updatedAt', 'DESC']], limit: 2000 });
  const names = await adminNames(scores.flatMap((s) => [s.enteredBy, s.signedBy]));

  return res.json({
    scores: scores.map((s) => serializeScore(s, maps, names)),
    filters: {
      stages: ctx.stages.map((s) => ({ id: s.id, number: s.number, name: s.name })),
      divisions: ctx.divisions.map((d) => ({ id: d.id, name: d.name, code: d.code })),
      squads: ctx.squads.map((s) => ({ id: s.id, name: s.name })),
    },
  });
});

async function loadScoreWithContext(scoreId) {
  const score = await Score.findByPk(scoreId);
  if (!score) return null;
  const match = await Match.findByPk(score.matchId);
  const ctx = await loadMatchContext(match.competitionId);
  return { score, ctx: { ...ctx, match } };
}

router.get('/scoring/scores/:scoreId', canView, async (req, res) => {
  const loaded = await loadScoreWithContext(req.params.scoreId);
  if (!loaded) return res.status(404).json({ message: 'Оноо олдсонгүй.' });
  const { score, ctx } = loaded;
  const maps = lookups(ctx);

  const [revisions, logs, siblings] = await Promise.all([
    ScoreRevision.findAll({ where: { scoreId: score.id }, order: [['revisionNumber', 'DESC']] }),
    AuditLog.findAll({ where: { entityType: 'Score', entityId: score.id }, order: [['createdAt', 'DESC']] }),
    Score.findAll({
      where: { matchId: score.matchId, stageId: score.stageId, competitorId: score.competitorId, id: { [Op.ne]: score.id } },
      order: [['createdAt', 'DESC']],
    }),
  ]);
  const names = await adminNames([
    score.enteredBy,
    score.signedBy,
    ...revisions.map((r) => r.changedBy),
    ...logs.map((l) => l.actorId),
    ...siblings.flatMap((s) => [s.enteredBy, s.signedBy]),
  ]);
  const stageResult = await StageResult.findOne({ where: { stageId: score.stageId, competitorId: score.competitorId } });

  return res.json({
    score: serializeScore(score, maps, names),
    stage: maps.stageById[score.stageId] ? serializeStage(maps.stageById[score.stageId]) : null,
    stageResult: stageResult
      ? {
          hitFactor: num(stageResult.hitFactor),
          bestHitFactor: num(stageResult.bestHitFactor),
          stagePoints: num(stageResult.stagePoints),
          stagePercentage: num(stageResult.stagePercentage),
          rank: stageResult.rank,
        }
      : null,
    revisions: revisions.map((r) => ({
      id: r.id,
      revisionNumber: r.revisionNumber,
      oldData: r.oldData,
      newData: r.newData,
      reason: r.reason,
      changedBy: person(r.changedBy, names),
      createdAt: r.createdAt,
    })),
    history: logs.map((l) => ({
      id: l.id,
      action: l.action,
      label: describeAction(l.action),
      reason: l.after?.reason || null,
      actor: l.actorId ? { id: l.actorId, name: names[l.actorId] || 'Тамирчин / төхөөрөмж' } : null,
      deviceId: l.deviceId,
      createdAt: l.createdAt,
    })),
    otherAttempts: siblings.map((s) => serializeScore(s, maps, names)),
  });
});

router.post('/scoring/scores/:scoreId/invalidate', canManage, async (req, res) => {
  const reason = String(req.body?.reason || '').trim();
  if (!reason) return res.status(400).json({ message: 'Хүчингүй болгох шалтгаан оруулна уу.' });
  const score = await Score.findByPk(req.params.scoreId);
  if (!score) return res.status(404).json({ message: 'Оноо олдсонгүй.' });
  if (score.status === 'INVALIDATED') return res.status(400).json({ message: 'Оноо аль хэдийн хүчингүй болсон.' });
  await invalidateScore(score.id, req.admin.id, reason, 'admin-web');
  return res.json({ ok: true });
});

router.post('/scoring/scores/:scoreId/sign', canManage, async (req, res) => {
  const reason = String(req.body?.reason || '').trim();
  const score = await Score.findByPk(req.params.scoreId, { include: [Competitor] });
  if (!score) return res.status(404).json({ message: 'Оноо олдсонгүй.' });
  if (!['ENTERED', 'CONFIRMED'].includes(score.status)) {
    return res.status(400).json({ message: 'Зөвхөн оруулсан (ENTERED/CONFIRMED) оноог баталгаажуулна.' });
  }
  const duplicate = await Score.findOne({
    where: { stageId: score.stageId, competitorId: score.competitorId, status: 'SIGNED', id: { [Op.ne]: score.id } },
  });
  if (duplicate) return res.status(400).json({ message: 'Энэ стейжид баталгаажсан оноо аль хэдийн байна.' });
  const before = score.toJSON();
  await score.update({ status: 'SIGNED', signedAt: new Date(), signedBy: req.admin.id });
  await audit(req, 'score.signed_by_admin', 'Score', score.id, before, { ...score.toJSON(), reason: reason || null });
  await recalculateAfterScore(score.matchId, score.stageId, score.Competitor?.matchDivisionId || score.Competitor?.divisionId);
  return res.json({ ok: true });
});

// ---------- Matrix ----------

router.get('/competitions/:id/scoring/matrix', canView, async (req, res) => {
  const ctx = await loadMatchContext(req.params.id);
  if (!ctx.competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (!ctx.match) return res.json({ stages: [], rows: [] });
  const maps = lookups(ctx);
  const scores = await Score.findAll({ where: { matchId: ctx.match.id } });
  const best = bestScoresByPair(scores);

  const rows = ctx.competitors.map((c) => {
    const cells = {};
    let signed = 0;
    for (const stage of ctx.stages) {
      const s = best[`${c.id}:${stage.id}`];
      if (s) {
        cells[stage.id] = { scoreId: s.id, status: s.status, hitFactor: num(s.hitFactor), timeSeconds: num(s.timeSeconds) };
        if (s.status === 'SIGNED') signed += 1;
      }
    }
    return { competitor: serializeCompetitor(c, maps), cells, signed, total: ctx.stages.length };
  });

  return res.json({
    stages: ctx.stages.map(serializeStage),
    squads: ctx.squads.map((s) => ({ id: s.id, name: s.name })),
    divisions: ctx.divisions.map((d) => ({ id: d.id, name: d.name, code: d.code })),
    rows,
  });
});

// ---------- Results ----------

router.get('/competitions/:id/scoring/results', canView, async (req, res) => {
  const ctx = await loadMatchContext(req.params.id);
  if (!ctx.competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (!ctx.match) return res.json({ match: null, stages: [], divisions: [] });
  const maps = lookups(ctx);

  const [matchResults, stageResults] = await Promise.all([
    MatchResult.findAll({ where: { matchId: ctx.match.id }, order: [['rank', 'ASC']] }),
    StageResult.findAll({ where: { matchId: ctx.match.id } }),
  ]);

  const stageByCompetitor = {};
  for (const sr of stageResults) {
    stageByCompetitor[sr.competitorId] = stageByCompetitor[sr.competitorId] || {};
    stageByCompetitor[sr.competitorId][sr.stageId] = {
      hitFactor: num(sr.hitFactor),
      stagePoints: num(sr.stagePoints),
      stagePercentage: num(sr.stagePercentage),
      rank: sr.rank,
    };
  }

  const divisions = ctx.divisions.map((d) => {
    const rows = matchResults
      .filter((r) => r.divisionId === d.id)
      .map((r) => {
        const c = maps.competitorById[r.competitorId];
        if (!c || c.status !== 'ACTIVE') return null;
        return {
          rank: r.rank,
          competitor: serializeCompetitor(c, maps),
          matchPoints: num(r.matchPoints),
          matchPercentage: num(r.matchPercentage),
          stages: stageByCompetitor[c.id] || {},
          stagesCompleted: Object.keys(stageByCompetitor[c.id] || {}).length,
        };
      })
      .filter(Boolean);
    const ranked = new Set(rows.map((r) => r.competitor.id));
    const unranked = ctx.competitors
      .filter((c) => c.matchDivisionId === d.id && !ranked.has(c.id))
      .map((c) => ({ competitor: serializeCompetitor(c, maps), reason: c.status === 'ACTIVE' ? 'NO_SCORES' : c.status }));
    return { id: d.id, name: d.name, code: d.code, rows, unranked };
  });

  return res.json({
    match: serializeMatch(ctx.match),
    stages: ctx.stages.map(serializeStage),
    divisions,
  });
});

// ---------- Match / stage / competitor management ----------

router.put('/scoring/matches/:matchId', canManage, async (req, res) => {
  const match = await Match.findByPk(req.params.matchId);
  if (!match) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  const { status } = req.body || {};
  if (!Object.values(MATCH_STATUS).includes(status)) return res.status(400).json({ message: 'Төлөв буруу байна.' });
  const before = match.toJSON();
  await match.update({ status });
  await audit(req, 'match.status_changed', 'Match', match.id, { status: before.status }, { status });
  return res.json({ match: serializeMatch(match) });
});

router.post('/scoring/matches/:matchId/stages', canManage, async (req, res) => {
  const match = await Match.findByPk(req.params.matchId);
  if (!match) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  const last = await Stage.max('number', { where: { matchId: match.id } });
  const number = (Number.isFinite(last) ? last : 0) + 1;
  const stage = await Stage.create({
    matchId: match.id,
    number,
    name: String(req.body?.name || '').trim() || `Stage ${number}`,
    courseType: COURSE_TYPES.includes(req.body?.courseType) ? req.body.courseType : 'SHORT',
    maximumPoints: Math.max(1, Number(req.body?.maximumPoints) || 100),
    minimumRounds: Math.max(0, Number(req.body?.minimumRounds) || 0),
    status: 'WAITING',
  });
  await audit(req, 'stage.created', 'Stage', stage.id, null, stage.toJSON());
  return res.json({ stage: serializeStage(stage) });
});

router.put('/scoring/stages/:stageId', canManage, async (req, res) => {
  const stage = await Stage.findByPk(req.params.stageId);
  if (!stage) return res.status(404).json({ message: 'Стейж олдсонгүй.' });
  const body = req.body || {};
  const patch = {};
  if (body.name !== undefined) patch.name = String(body.name).trim() || stage.name;
  if (COURSE_TYPES.includes(body.courseType)) patch.courseType = body.courseType;
  if (STAGE_STATUSES.includes(body.status)) patch.status = body.status;
  for (const key of ['minimumRounds', 'maximumPoints', 'paperTargetCount', 'metalTargetCount', 'noShootCount']) {
    if (body[key] !== undefined && Number.isFinite(Number(body[key]))) patch[key] = Math.max(0, Math.round(Number(body[key])));
  }
  if (patch.maximumPoints === 0) return res.status(400).json({ message: 'Дээд оноо 0 байж болохгүй.' });
  const before = stage.toJSON();
  await stage.update(patch);
  if (patch.maximumPoints !== undefined && patch.maximumPoints !== before.maximumPoints) {
    await recalculateWholeMatch(stage.matchId);
  }
  await audit(req, 'stage.updated', 'Stage', stage.id, before, stage.toJSON());
  return res.json({ stage: serializeStage(stage) });
});

router.delete('/scoring/stages/:stageId', canManage, async (req, res) => {
  const stage = await Stage.findByPk(req.params.stageId);
  if (!stage) return res.status(404).json({ message: 'Стейж олдсонгүй.' });
  const used = await Score.count({ where: { stageId: stage.id } });
  if (used) return res.status(400).json({ message: `Энэ стейжид ${used} оноо бүртгэгдсэн тул устгах боломжгүй.` });
  await StageResult.destroy({ where: { stageId: stage.id } });
  await audit(req, 'stage.deleted', 'Stage', stage.id, stage.toJSON(), null);
  await stage.destroy();
  return res.json({ ok: true });
});

router.post('/scoring/matches/:matchId/squads', canManage, async (req, res) => {
  const match = await Match.findByPk(req.params.matchId);
  if (!match) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ message: 'Скуадын нэр оруулна уу.' });
  const exists = await Squad.findOne({ where: { matchId: match.id, name } });
  if (exists) return res.status(400).json({ message: 'Ийм нэртэй скуад байна.' });
  const squad = await Squad.create({ matchId: match.id, name, status: 'WAITING' });
  return res.json({ squad: { id: squad.id, name: squad.name, status: squad.status } });
});

router.put('/scoring/competitors/:competitorId', canManage, async (req, res) => {
  const competitor = await Competitor.findByPk(req.params.competitorId);
  if (!competitor) return res.status(404).json({ message: 'Оролцогч олдсонгүй.' });
  const body = req.body || {};
  const patch = {};
  if (COMPETITOR_STATUSES.includes(body.status)) patch.status = body.status;
  if (POWER_FACTORS.includes(body.powerFactor)) patch.powerFactor = body.powerFactor;
  if (body.bibNumber !== undefined) patch.bibNumber = String(body.bibNumber).trim() || null;
  if (body.squadId !== undefined) {
    const squad = body.squadId ? await Squad.findOne({ where: { id: body.squadId, matchId: competitor.matchId } }) : null;
    if (body.squadId && !squad) return res.status(400).json({ message: 'Скуад олдсонгүй.' });
    patch.squadId = squad?.id || null;
  }
  if (body.matchDivisionId !== undefined) {
    const div = body.matchDivisionId
      ? await MatchDivision.findOne({ where: { id: body.matchDivisionId, matchId: competitor.matchId } })
      : null;
    if (body.matchDivisionId && !div) return res.status(400).json({ message: 'Ангилал олдсонгүй.' });
    patch.matchDivisionId = div?.id || null;
    if (div?.divisionId) patch.divisionId = div.divisionId;
  }
  const before = competitor.toJSON();
  await competitor.update(patch);
  const affectsResults = ['status', 'matchDivisionId'].some((k) => patch[k] !== undefined && patch[k] !== before[k]);
  if (affectsResults) await recalculateWholeMatch(competitor.matchId);
  await audit(req, 'competitor.updated', 'Competitor', competitor.id, before, { ...competitor.toJSON(), reason: body.reason || null });
  return res.json({ ok: true });
});

module.exports = router;
