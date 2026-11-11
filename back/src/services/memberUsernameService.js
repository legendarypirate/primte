const { Op } = require('sequelize');
const { Member } = require('../models');
const { resolveMemberNames } = require('../domain/names');

async function uniqueUsername(base, excludeId) {
  const cleaned = String(base || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '')
    || 'member';
  let candidate = cleaned;
  let n = 1;
  while (
    await Member.findOne({
      where: {
        username: candidate,
        ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
      },
    })
  ) {
    n += 1;
    candidate = `${cleaned}${n}`;
  }
  return candidate;
}

async function backfillMemberUsernames() {
  const members = await Member.findAll({ where: { username: { [Op.or]: [null, ''] } } });
  for (const member of members) {
    member.username = await uniqueUsername(member.memberCode || member.name, member.id);
    await member.save();
  }
}

async function backfillMemberNames() {
  const members = await Member.findAll({
    where: {
      [Op.or]: [{ firstName: { [Op.or]: [null, ''] } }, { lastName: { [Op.or]: [null, ''] } }],
    },
  });
  for (const member of members) {
    if (member.firstName && member.lastName) continue;
    const names = resolveMemberNames({
      firstName: member.firstName,
      lastName: member.lastName,
      name: member.name,
    });
    member.firstName = names.firstName;
    member.lastName = names.lastName;
    if (names.name) member.name = names.name;
    await member.save();
  }
}

module.exports = { uniqueUsername, backfillMemberUsernames, backfillMemberNames };
