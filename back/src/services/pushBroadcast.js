const { Op } = require('sequelize');
const { Member, Parent } = require('../models');
const { isPushConfigured, sendToTokens, sendToTopic } = require('./pushNotification');

const CLUB_TOPIC = 'prime_club';

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
  return [...new Set([...members, ...parents].map((row) => row.fcmToken).filter(Boolean))];
}

async function broadcastToAllUsers({ title, body, data = {} }) {
  if (!isPushConfigured()) {
    console.warn('FCM: broadcast skipped — Firebase is not configured');
    return { skipped: true, successCount: 0, failureCount: 0, tokenCount: 0 };
  }

  const payload = { title, body, data };
  const result = {
    skipped: false,
    topic: null,
    successCount: 0,
    failureCount: 0,
    tokenCount: 0,
  };

  try {
    const tokens = await collectDeviceTokens();
    result.tokenCount = tokens.length;
    if (tokens.length) {
      const tokenResult = await sendToTokens(tokens, payload);
      result.successCount = tokenResult.successCount;
      result.failureCount = tokenResult.failureCount;
      console.log(`FCM: broadcast "${title}" tokens=${tokenResult.successCount}/${tokens.length}`);
    } else {
      // No stored device tokens yet — topic still reaches subscribed apps.
      result.topic = await sendToTopic(CLUB_TOPIC, payload);
      console.log(`FCM: broadcast "${title}" topic=${CLUB_TOPIC} (no tokens)`);
    }
  } catch (err) {
    console.error('FCM: broadcast failed', err);
  }

  return result;
}

module.exports = { CLUB_TOPIC, collectDeviceTokens, broadcastToAllUsers };
