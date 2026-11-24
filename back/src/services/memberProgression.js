const { Op } = require('sequelize');
const { Member, MemberType } = require('../models');
const {
  THRESHOLDS,
  computeMembershipLevel,
  membershipLabel,
} = require('../domain/membership');
const { clampAbsoluteScores } = require('../domain/points');

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

const NON_MEMBER_TYPE = {
  name: 'Non member',
  slug: 'non-member',
  category: 'non-member',
  isInactive: false,
  requiresParent: false,
  hasAppAccess: true,
  isSystem: true,
  sortOrder: 0,
};

async function ensureSystemMemberTypes() {
  await MemberType.findOrCreate({
    where: { slug: NON_MEMBER_TYPE.slug },
    defaults: NON_MEMBER_TYPE,
  });
}

async function resolveMembershipTypeId({ level, currentType }) {
  if (currentType?.isInactive) return currentType.id;
  if (currentType?.slug === 'non-member' || currentType?.category === 'non-member') return currentType.id;
  // Junior academy levels are assigned in admin, not by XP/RP.
  if (currentType?.category === 'junior') return currentType.id;
  const typed = Number(currentType?.level);
  const effective = Math.max(level, Number.isFinite(typed) ? typed : 0);
  const slug = effective <= 0 ? 'student-member' : `official-l${effective}`;
  const type = await MemberType.findOne({ where: { slug } });
  return type?.id || currentType?.id || null;
}

async function applyMemberProgression(data = {}, { current, syncType = false } = {}) {
  const next = clampAbsoluteScores(current, {
    xp: data.xp !== undefined ? data.xp : current?.xp,
    rp: data.rp !== undefined ? data.rp : current?.rp,
  });
  const xp = next.xp;
  const rp = next.rp;
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
    currentType,
  });
  if (typeId) data.memberTypeId = typeId;
  return data;
}

async function ensureStudentDefaults() {
  const student = await MemberType.findOne({ where: { slug: 'student-member' } });
  if (student) {
    await Member.update(
      { memberTypeId: student.id },
      { where: { memberTypeId: null } }
    );
  }
  await require('./pointLedger').stripSyntheticPointHistory();
}

function grantMembersExperience(memberIds, delta, extra) {
  return require('./pointLedger').grantMembersExperience(memberIds, delta, extra);
}

module.exports = {
  THRESHOLDS,
  computeMembershipLevel,
  membershipLabel,
  nextStudentCode,
  applyMemberProgression,
  grantMembersExperience,
  ensureStudentDefaults,
  ensureSystemMemberTypes,
};
