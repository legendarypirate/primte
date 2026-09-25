const { Op } = require('sequelize');
const { Member } = require('../models');

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

module.exports = { uniqueUsername, backfillMemberUsernames };
