const bcrypt = require('bcryptjs');
const {
  sequelize,
  Score,
  ScoreRevision,
  AuditLog,
  Match,
  Stage,
  Competitor,
  ScoringProfile,
} = require('../models');
const { calculateScore } = require('../domain/scoring/scoring-engine');
const { validateScoreInput, MESSAGES } = require('../domain/scoring/scoring-validation');
const { SCORE_STATUS, MATCH_STATUS } = require('../domain/scoring/scoring-types');
const { getScoringProfile, PROFILES } = require('../domain/scoring/scoring-profile');
const { recalculateAfterScore } = require('./resultService');

async function loadProfileForMatch(match) {
  const row = await ScoringProfile.findByPk(match.scoringProfileId);
  if (row) return row.toJSON();
  return getScoringProfile(match.scoringProfileId) || PROFILES.IPSC_ACTION_AIR;
}

async function assertMatchEditable(matchId) {
  const match = await Match.findByPk(matchId);
  if (!match) throw new Error(MESSAGES.STAGE_NOT_FOUND);
  if (match.status === MATCH_STATUS.FINAL) throw new Error(MESSAGES.MATCH_FINALIZED);
  return match;
}

async function createOrUpdateScore(payload, actorId, deviceId) {
  const errors = validateScoreInput(payload);
  if (errors.length) throw new Error(errors[0]);

  const match = await assertMatchEditable(payload.matchId);
  const stage = await Stage.findByPk(payload.stageId);
  const competitor = await Competitor.findByPk(payload.competitorId);
  if (!stage || stage.matchId !== match.id) throw new Error(MESSAGES.STAGE_NOT_FOUND);
  if (!competitor || competitor.matchId !== match.id) throw new Error(MESSAGES.COMPETITOR_NOT_FOUND);

  const profile = await loadProfileForMatch(match);
  const calc = calculateScore(profile, competitor.powerFactor, payload);

  return sequelize.transaction(async (t) => {
    let score = await Score.findOne({
      where: { stageId: payload.stageId, competitorId: payload.competitorId },
      transaction: t,
      lock: true,
    });

    if (score && payload.expectedVersion && score.version !== payload.expectedVersion) {
      const err = new Error(MESSAGES.VERSION_CONFLICT);
      err.code = 'VERSION_CONFLICT';
      err.serverScore = score;
      throw err;
    }

    if (score && score.status === SCORE_STATUS.SIGNED && !payload.allowOverride) {
      throw new Error(MESSAGES.ALREADY_CONFIRMED);
    }

    const data = {
      matchId: match.id,
      stageId: stage.id,
      competitorId: competitor.id,
      timeSeconds: payload.timeSeconds,
      alphaHits: payload.alphaHits || 0,
      charlieHits: payload.charlieHits || 0,
      deltaHits: payload.deltaHits || 0,
      missCount: payload.missCount || 0,
      noShootCount: payload.noShootCount || 0,
      proceduralCount: payload.proceduralCount || 0,
      otherPenaltyPoints: payload.otherPenaltyPoints || 0,
      hitPoints: calc.hitPoints,
      penaltyPoints: calc.penaltyPoints,
      pointsAfterPenalty: calc.pointsAfterPenalty,
      effectivePoints: calc.effectivePoints,
      hitFactor: calc.hitFactor,
      status: SCORE_STATUS.ENTERED,
      enteredBy: actorId,
      deviceId,
    };

    if (score) {
      const oldData = score.toJSON();
      await ScoreRevision.create(
        {
          scoreId: score.id,
          revisionNumber: score.version,
          oldData,
          newData: { ...oldData, ...data },
          changedBy: actorId,
          reason: payload.reason || null,
        },
        { transaction: t }
      );
      await score.update({ ...data, version: score.version + 1 }, { transaction: t });
      await AuditLog.create(
        {
          actorId,
          action: 'score.edited',
          entityType: 'Score',
          entityId: score.id,
          before: oldData,
          after: score.toJSON(),
          deviceId,
        },
        { transaction: t }
      );
    } else {
      const dup = await Score.findOne({
        where: {
          stageId: stage.id,
          competitorId: competitor.id,
          status: [SCORE_STATUS.ENTERED, SCORE_STATUS.CONFIRMED, SCORE_STATUS.SIGNED],
        },
        transaction: t,
      });
      if (dup) throw new Error(MESSAGES.DUPLICATE_SCORE);

      score = await Score.create(data, { transaction: t });
      await AuditLog.create(
        {
          actorId,
          action: 'score.created',
          entityType: 'Score',
          entityId: score.id,
          after: score.toJSON(),
          deviceId,
        },
        { transaction: t }
      );
    }

    return score;
  });
}

async function confirmScore(scoreId, pin, competitorId, officialId, deviceId) {
  const score = await Score.findByPk(scoreId, { include: [Competitor] });
  if (!score) throw new Error(MESSAGES.SCORE_INCOMPLETE);
  if (score.competitorId !== competitorId) throw new Error(MESSAGES.COMPETITOR_NOT_FOUND);
  if (score.status === SCORE_STATUS.SIGNED) throw new Error(MESSAGES.ALREADY_CONFIRMED);

  const member = await require('../models/member').findByPk(score.Competitor.memberId);
  if (!member) throw new Error(MESSAGES.COMPETITOR_NOT_FOUND);

  const ok = await bcrypt.compare(String(pin), member.pinHash);
  if (!ok) throw new Error('PIN код буруу байна.');

  await score.update({
    status: SCORE_STATUS.SIGNED,
    signedAt: new Date(),
    signedBy: officialId,
    deviceId,
  });

  await AuditLog.create({
    actorId: officialId,
    action: 'score.confirmed',
    entityType: 'Score',
    entityId: score.id,
    after: score.toJSON(),
    deviceId,
  });

  await recalculateAfterScore(
    score.matchId,
    score.stageId,
    score.Competitor.matchDivisionId || score.Competitor.divisionId
  );

  return score;
}

async function invalidateScore(scoreId, actorId, reason, deviceId) {
  const score = await Score.findByPk(scoreId, { include: [Competitor] });
  if (!score) throw new Error(MESSAGES.SCORE_INCOMPLETE);
  const old = score.toJSON();
  await score.update({ status: SCORE_STATUS.INVALIDATED });
  await AuditLog.create({
    actorId,
    action: 'score.invalidated',
    entityType: 'Score',
    entityId: score.id,
    before: old,
    after: score.toJSON(),
    deviceId,
  });
  await recalculateAfterScore(
    score.matchId,
    score.stageId,
    score.Competitor?.matchDivisionId || score.Competitor?.divisionId
  );
  return score;
}

module.exports = {
  createOrUpdateScore,
  confirmScore,
  invalidateScore,
  MESSAGES,
};
