const { Op } = require('sequelize');
const { Member, MemberType } = require('../models');
const {
  THRESHOLDS,
  toInt,
  computeMembershipLevel,
  membershipLabel,
} = require('../domain/membership');

async function nextStudentCode() {
  const rows = await Member.findAll({
    attributes: ['memberCode'],
    where: { memberCode: { [Op.iLike]: 'S%' } },
  });
  let max = 0;
  for (const row of rows) {
    const match = String(row.memberCode || '').trim().match(/^S(\d+)$/i);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return `S${String(max + 1).padStart(4, '0')}`;
}

async function resolveMembershipTypeId({ level, hasParent, currentType }) {
  if (currentType?.isInactive) return currentType.id;
  const slug = level <= 0
    ? 'student-member'
    : hasParent
      ? `junior-l${level}`
      : `official-l${level}`;
  const type = await MemberType.findOne({ where: { slug } });
  return type?.id || currentType?.id || null;
}

function hasParentLink(data = {}, current) {
  if (data.parentAccountId === null || data.parentAccountId === '') return false;
  return Boolean(
    data.parentAccountId ||
    data.parentId ||
    current?.parentAccountId ||
    current?.parentId
  );
}

async function applyMemberProgression(data = {}, { current, syncType = false } = {}) {
  const xp = data.xp !== undefined ? toInt(data.xp) : toInt(current?.xp);
  const rp = data.rp !== undefined ? toInt(data.rp) : toInt(current?.rp);
  const level = computeMembershipLevel(xp, rp);
  data.xp = xp;
  data.rp = rp;
  data.level = level;

  if (!syncType) return data;

  const currentType = current?.MemberType
    || (data.memberTypeId ? await MemberType.findByPk(data.memberTypeId) : null)
    || (current?.memberTypeId ? await MemberType.findByPk(current.memberTypeId) : null);

  const typeId = await resolveMembershipTypeId({
    level,
    hasParent: hasParentLink(data, current),
    currentType,
  });
  if (typeId) data.memberTypeId = typeId;
  return data;
}

const MIN_SCORES = {
  1: { xp: 51, rp: 0 },
  2: { xp: 51, rp: 151 },
  3: { xp: 201, rp: 601 },
};

async function ensureStudentDefaults() {
  const types = await MemberType.findAll();
  const byId = Object.fromEntries(types.map((type) => [type.id, type]));
  const student = types.find((type) => type.slug === 'student-member');
  if (student) {
    await Member.update(
      { memberTypeId: student.id },
      { where: { memberTypeId: null } }
    );
  }

  const members = await Member.findAll();
  for (const member of members) {
    const type = byId[member.memberTypeId];
    const hasScores = (member.xp || 0) > 0 || (member.rp || 0) > 0;
    if (!hasScores && type?.level) {
      const mins = MIN_SCORES[type.level];
      if (mins) {
        member.xp = mins.xp;
        member.rp = mins.rp;
        member.level = type.level;
        await member.save();
        continue;
      }
    }
    const level = computeMembershipLevel(member.xp, member.rp);
    if (member.level !== level) {
      member.level = level;
      await member.save();
    }
  }
}

module.exports = {
  THRESHOLDS,
  computeMembershipLevel,
  membershipLabel,
  nextStudentCode,
  applyMemberProgression,
  ensureStudentDefaults,
};
