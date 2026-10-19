const { Member, MemberPointEvent, MemberType } = require('../models');
const { formatDate, formatTime } = require('../utils/helpers');
const { applyPointDelta, POINT_RULES, competitionXpAward, XP_AWARDS } = require('../domain/points');

const SOURCE_TITLES = {
  training_hour: XP_AWARDS.trainingHour.title,
  training_match: XP_AWARDS.trainingMatch.title,
  competition: XP_AWARDS.competition.title,
  rating: 'Чансааны оноо',
  admin: 'Админ бүртгэл',
  opening: 'Эхний үлдэгдэл',
};

function serializePointEvent(event) {
  const up = event.delta >= 0;
  return {
    id: event.id,
    kind: event.kind,
    source: event.source,
    delta: event.delta,
    balanceAfter: event.balanceAfter,
    title: event.title,
    note: event.note || '',
    dateLabel: formatDate(event.createdAt),
    timeLabel: formatTime(event.createdAt),
    signedLabel: `${up ? '+' : ''}${event.delta}`,
    createdAt: event.createdAt,
  };
}

async function writeEvents(member, {
  xpDelta = 0,
  rpDelta = 0,
  xpAfter,
  rpAfter,
  source = 'admin',
  title,
  note,
  refType,
  refId,
} = {}, { transaction } = {}) {
  const rows = [];
  if (xpDelta > 0) {
    rows.push({
      memberId: member.id,
      kind: 'xp',
      source: source === 'rating' ? 'admin' : source,
      delta: xpDelta,
      balanceAfter: xpAfter,
      title: title || SOURCE_TITLES[source] || SOURCE_TITLES.admin,
      note: note || null,
      refType: refType || null,
      refId: refId || null,
    });
  }
  if (rpDelta !== 0) {
    rows.push({
      memberId: member.id,
      kind: 'rp',
      source: source === 'opening' ? 'opening' : 'rating',
      delta: rpDelta,
      balanceAfter: rpAfter,
      title: title || (source === 'opening' ? SOURCE_TITLES.opening : SOURCE_TITLES.rating),
      note: note || null,
      refType: refType || null,
      refId: refId || null,
    });
  }
  if (!rows.length) return [];
  return MemberPointEvent.bulkCreate(rows, { transaction });
}

async function applyMemberPoints(member, delta, meta = {}, { transaction } = {}) {
  const next = applyPointDelta(member, delta);
  if (next.xpDelta === 0 && next.rpDelta === 0) return member;

  const { applyMemberProgression } = require('./memberProgression');
  const data = {
    xp: next.xp,
    rp: next.rp,
    parentAccountId: member.parentAccountId,
    parentId: member.parentId,
    memberTypeId: member.memberTypeId,
  };
  await applyMemberProgression(data, { current: member, syncType: true });
  await member.update({
    xp: data.xp,
    rp: data.rp,
    level: data.level,
    memberTypeId: data.memberTypeId,
  }, { transaction });
  await writeEvents(member, {
    xpDelta: next.xpDelta,
    rpDelta: next.rpDelta,
    xpAfter: data.xp,
    rpAfter: data.rp,
    ...meta,
  }, { transaction });
  return member;
}

async function grantMembersExperience(memberIds, { xp = 0, rp = 0 } = {}, extra = {}) {
  const { transaction, ...meta } = extra;
  const ids = [...new Set((memberIds || []).map(String).filter(Boolean))];
  if (!ids.length) return [];
  const members = await Member.findAll({
    where: { id: ids },
    include: [MemberType],
    transaction,
  });
  for (const member of members) {
    await applyMemberPoints(member, { xp, rp }, meta, { transaction });
  }
  return members;
}

async function recordAbsoluteChange(member, { prevXp, prevRp, source = 'admin', title, note } = {}, { transaction } = {}) {
  const xpDelta = Math.max(0, (member.xp || 0) - (prevXp || 0));
  const rpDelta = (member.rp || 0) - (prevRp || 0);
  return writeEvents(member, {
    xpDelta,
    rpDelta,
    xpAfter: member.xp || 0,
    rpAfter: member.rp || 0,
    source,
    title,
    note,
  }, { transaction });
}

async function ensureOpeningBalance(member, { transaction } = {}) {
  const count = await MemberPointEvent.count({ where: { memberId: member.id }, transaction });
  if (count > 0) return;
  const xp = member.xp || 0;
  const rp = member.rp || 0;
  if (xp <= 0 && rp <= 0) return;
  await writeEvents(member, {
    xpDelta: xp,
    rpDelta: rp,
    xpAfter: xp,
    rpAfter: rp,
    source: 'opening',
    title: SOURCE_TITLES.opening,
  }, { transaction });
}

async function alreadyAwarded(memberId, { source, refId, kind = 'xp' }, { transaction } = {}) {
  if (!refId) return false;
  const row = await MemberPointEvent.findOne({
    where: { memberId, source, refId, kind },
    transaction,
  });
  return Boolean(row);
}

async function awardCompetitionXp(member, competition, { transaction } = {}) {
  if (!member?.id || !competition?.id) return null;
  const award = competitionXpAward(competition);
  if (await alreadyAwarded(member.id, { source: award.source, refId: competition.id }, { transaction })) {
    return null;
  }
  return applyMemberPoints(
    member,
    { xp: award.xp },
    {
      source: award.source,
      title: award.title,
      note: competition.title,
      refType: 'competition',
      refId: competition.id,
    },
    { transaction }
  );
}

async function awardTrainingHourXp(member, attendance, { hours = 1, transaction } = {}) {
  if (!member?.id || !attendance?.id) return null;
  if (await alreadyAwarded(member.id, { source: 'training_hour', refId: attendance.id }, { transaction })) {
    return null;
  }
  const xp = XP_AWARDS.trainingHour.xp * Math.max(1, Math.floor(Number(hours) || 1));
  return applyMemberPoints(
    member,
    { xp },
    {
      source: 'training_hour',
      title: XP_AWARDS.trainingHour.title,
      note: attendance.title || 'Бэлтгэл',
      refType: 'attendance',
      refId: attendance.id,
    },
    { transaction }
  );
}

async function listPointHistory(member, { kind } = {}) {
  await ensureOpeningBalance(member);
  const where = { memberId: member.id };
  if (kind === 'xp' || kind === 'rp') where.kind = kind;
  const events = await MemberPointEvent.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  return {
    xp: member.xp || 0,
    rp: member.rp || 0,
    rules: POINT_RULES,
    events: events.map(serializePointEvent),
  };
}

module.exports = {
  POINT_RULES,
  serializePointEvent,
  writeEvents,
  applyMemberPoints,
  grantMembersExperience,
  recordAbsoluteChange,
  ensureOpeningBalance,
  awardCompetitionXp,
  awardTrainingHourXp,
  listPointHistory,
};
