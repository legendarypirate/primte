const { Member, DevelopmentActivity } = require('../models');

function developmentActivitiesInclude() {
  return { model: DevelopmentActivity, as: 'developmentActivities' };
}

function normalizeActivityIds(...values) {
  const ids = [];
  for (const value of values) {
    if (Array.isArray(value)) ids.push(...value);
    else if (value) ids.push(value);
  }
  return [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];
}

async function setMemberActivities(member, ids, { transaction } = {}) {
  const unique = normalizeActivityIds(ids);
  await member.setDevelopmentActivities(unique, { transaction });
  const primary = unique[0] || null;
  if (member.developmentActivityId !== primary) {
    await member.update({ developmentActivityId: primary }, { transaction });
    member.developmentActivityId = primary;
  }
  return unique;
}

async function backfillMemberActivities() {
  const members = await Member.findAll({
    attributes: ['id', 'developmentActivityId'],
    include: [{ model: DevelopmentActivity, as: 'developmentActivities', attributes: ['id'] }],
  });
  for (const member of members) {
    if (!member.developmentActivityId) continue;
    if (member.developmentActivities?.length) continue;
    await member.addDevelopmentActivity(member.developmentActivityId);
  }
}

module.exports = {
  developmentActivitiesInclude,
  normalizeActivityIds,
  setMemberActivities,
  backfillMemberActivities,
};
