const { Op } = require('sequelize');
const { Member, Parent } = require('../models');
const { isPushConfigured, sendToTokens, sendToTopic } = require('./pushNotification');
const { normalizeMemberTypeIds } = require('../domain/notices');

const CLUB_TOPIC = 'prime_club';

function uniqueTokens(rows) {
  return [...new Set((rows || []).map((row) => row.fcmToken).filter(Boolean))];
}

async function collectDeviceTokens() {
  const [members, parents] = await Promise.all([
    Member.findAll({
      where: { fcmToken: { [Op.ne]: null } },
      attributes: ['fcmToken'],
    }),
    Parent.findAll({
      where: { fcmToken: { [Op.ne]: null } },
      attributes: ['fcmToken'],
    }),
  ]);
  return uniqueTokens([...members, ...parents]);
}

async function collectDeviceTokensForMemberTypes(memberTypeIds) {
  const ids = normalizeMemberTypeIds(memberTypeIds);
  if (!ids.length) return collectDeviceTokens();

  const members = await Member.findAll({
    where: {
      memberTypeId: { [Op.in]: ids },
      [Op.or]: [{ fcmToken: { [Op.ne]: null } }, { parentAccountId: { [Op.ne]: null } }],
    },
    attributes: ['fcmToken', 'parentAccountId'],
  });
  const parentIds = [...new Set(members.map((row) => row.parentAccountId).filter(Boolean))];
  const parents = parentIds.length
    ? await Parent.findAll({
        where: { id: { [Op.in]: parentIds }, fcmToken: { [Op.ne]: null } },
        attributes: ['fcmToken'],
      })
    : [];
  return uniqueTokens([...members, ...parents]);
}

async function broadcastToAllUsers({ title, body, data = {}, memberTypeIds } = {}) {
  if (!isPushConfigured()) {
    console.warn('FCM: broadcast skipped — Firebase is not configured');
    return { skipped: true, successCount: 0, failureCount: 0, tokenCount: 0 };
  }

  const ids = normalizeMemberTypeIds(memberTypeIds);
  const payload = { title, body, data };
  const result = {
    skipped: false,
    topic: null,
    successCount: 0,
    failureCount: 0,
    tokenCount: 0,
  };

  try {
    const tokens = ids.length
      ? await collectDeviceTokensForMemberTypes(ids)
      : await collectDeviceTokens();
    result.tokenCount = tokens.length;
    if (tokens.length) {
      const tokenResult = await sendToTokens(tokens, payload);
      result.successCount = tokenResult.successCount;
      result.failureCount = tokenResult.failureCount;
      console.log(
        `FCM: broadcast "${title}" tokens=${tokenResult.successCount}/${tokens.length}` +
          (ids.length ? ` types=${ids.length}` : '')
      );
    } else if (!ids.length) {
      result.topic = await sendToTopic(CLUB_TOPIC, payload);
      console.log(`FCM: broadcast "${title}" topic=${CLUB_TOPIC} (no tokens)`);
    } else {
      console.log(`FCM: broadcast "${title}" skipped — no tokens for selected member types`);
    }
  } catch (err) {
    console.error('FCM: broadcast failed', err);
  }

  return result;
}

module.exports = {
  CLUB_TOPIC,
  collectDeviceTokens,
  collectDeviceTokensForMemberTypes,
  broadcastToAllUsers,
};
