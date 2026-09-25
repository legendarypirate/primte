const {
  sequelize,
  Competitor,
  Squad,
  Match,
  MatchDivision,
  MatchCategory,
  Registration,
  Member,
  Division,
  Stage,
  Score,
  ScoreRevision,
  StageResult,
  MatchResult,
} = require('../models');
const { PROFILES } = require('../domain/scoring/scoring-profile');
const AuditLog = require('../models/auditLog');

async function findOrCreateSquad(matchId, squadLabel, transaction) {
  const name = squadLabel || 'General';
  let squad = await Squad.findOne({ where: { matchId, name }, transaction });
  if (!squad) {
    squad = await Squad.create({ matchId, name, status: 'WAITING' }, { transaction });
  }
  return squad;
}

async function findOrCreateMatchDivision(matchId, division, transaction) {
  if (!division) return null;
  let md = await MatchDivision.findOne({
    where: { matchId, code: division.abbreviation || division.name },
    transaction,
  });
  if (!md) {
    md = await MatchDivision.create(
      {
        matchId,
        divisionId: division.id,
        name: division.name,
        code: division.abbreviation || division.name,
        enabled: true,
      },
      { transaction }
    );
  }
  return md;
}

async function findOrCreateMatchCategory(matchId, categoryName, transaction) {
  if (!categoryName) return null;
  let cat = await MatchCategory.findOne({ where: { matchId, code: categoryName }, transaction });
  if (!cat) {
    cat = await MatchCategory.create(
      { matchId, name: categoryName, code: categoryName, enabled: true },
      { transaction }
    );
  }
  return cat;
}

async function ensureMatchForCompetition(competition, transaction) {
  let match = await Match.findOne({ where: { competitionId: competition.id }, transaction });
  if (!match) {
    match = await Match.create(
      {
        competitionId: competition.id,
        name: competition.title,
        discipline: 'IPSC',
        scoringProfileId: 'IPSC_ACTION_AIR',
        status: 'REGISTRATION',
        startDate: competition.eventDate,
        endDate: competition.eventEndDate,
        location: competition.location,
      },
      { transaction }
    );
    const stageCount = competition.stageCount || 6;
    for (let i = 1; i <= stageCount; i++) {
      await Stage.create(
        {
          matchId: match.id,
          number: i,
          name: `Stage ${i}`,
          courseType: 'SHORT',
          maximumPoints: 100,
          status: 'WAITING',
        },
        { transaction }
      );
    }
  }
  return match;
}

async function ensureCompetitorFromRegistration(registrationId, options = {}) {
  const { Competition } = require('../models');
  const registration = await Registration.findByPk(registrationId, {
    include: [Member, Division, Competition],
  });
  if (!registration) return null;
  if (!['paid', 'confirmed'].includes(registration.status)) return null;

  const member = registration.Member;
  const competition = registration.Competition;
  if (!member || !competition) return null;

  const existing = await Competitor.findOne({ where: { registrationId } });
  if (existing) return existing;

  return sequelize.transaction(async (t) => {
    const dup = await Competitor.findOne({ where: { registrationId }, transaction: t, lock: true });
    if (dup) return dup;

    const match = await ensureMatchForCompetition(competition, t);
    const squad = await findOrCreateSquad(match.id, registration.squadLabel, t);
    const matchDivision = await findOrCreateMatchDivision(match.id, registration.Division, t);
    const matchCategory = await findOrCreateMatchCategory(match.id, registration.category, t);

    const nameParts = (member.name || 'Unknown').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    const competitor = await Competitor.create(
      {
        matchId: match.id,
        registrationId: registration.id,
        memberId: member.id,
        bibNumber: registration.paymentReference || String(member.memberCode),
        firstName,
        lastName,
        divisionId: registration.divisionId,
        matchDivisionId: matchDivision?.id || null,
        categoryId: matchCategory?.id || null,
        powerFactor: options.powerFactor || 'MINOR',
        squadId: squad.id,
        status: 'ACTIVE',
      },
      { transaction: t }
    );

    await AuditLog.create(
      {
        actorId: options.actorId || null,
        action: 'competitor.created_from_registration',
        entityType: 'Competitor',
        entityId: competitor.id,
        after: competitor.toJSON(),
      },
      { transaction: t }
    );

    return competitor;
  });
}

async function getSquadCompetitors(squadId) {
  return Competitor.findAll({
    where: { squadId, status: 'ACTIVE' },
    order: [['bibNumber', 'ASC']],
  });
}

async function getSquadQueue(squadId, stageId) {
  const competitors = await getSquadCompetitors(squadId);
  const Score = require('../models/score');
  const signed = await Score.findAll({
    where: { stageId, status: 'SIGNED' },
    attributes: ['competitorId'],
  });
  const done = new Set(signed.map((s) => s.competitorId));
  return competitors.filter((c) => !done.has(c.id));
}

async function getCurrentCompetitor(squadId, stageId) {
  const queue = await getSquadQueue(squadId, stageId);
  return queue[0] || null;
}

async function getNextCompetitor(squadId, stageId, currentCompetitorId) {
  const queue = await getSquadQueue(squadId, stageId);
  const idx = queue.findIndex((c) => c.id === currentCompetitorId);
  return idx >= 0 ? queue[idx + 1] || null : queue[0] || null;
}

async function removeCompetitorByRegistrationId(registrationId, { transaction } = {}) {
  const competitor = await Competitor.findOne({ where: { registrationId }, transaction });
  if (!competitor) return null;

  const scores = await Score.findAll({
    where: { competitorId: competitor.id },
    attributes: ['id'],
    transaction,
  });
  const scoreIds = scores.map((s) => s.id);
  if (scoreIds.length) {
    await ScoreRevision.destroy({ where: { scoreId: scoreIds }, transaction });
    await Score.destroy({ where: { competitorId: competitor.id }, transaction });
  }
  await StageResult.destroy({ where: { competitorId: competitor.id }, transaction });
  await MatchResult.destroy({ where: { competitorId: competitor.id }, transaction });
  await competitor.destroy({ transaction });
  return competitor.matchId;
}

module.exports = {
  ensureCompetitorFromRegistration,
  ensureMatchForCompetition,
  getSquadCompetitors,
  getSquadQueue,
  getCurrentCompetitor,
  getNextCompetitor,
  findOrCreateSquad,
  removeCompetitorByRegistrationId,
};
