const { Op } = require('sequelize');
const { Member, Parent, Notice } = require('../models');
const { isPushConfigured, sendToTokens, sendToTopic } = require('./pushNotification');

const CLUB_TOPIC = 'prime_club';

function clubStatusCopy(open) {
  if (open) {
    return {
      title: 'PRIME клуб нээгдлээ',
      body: 'Гишүүд клубт нэвтрэх боломжтой.',
    };
  }
  return {
    title: 'PRIME клуб хаагдлаа',
    body: 'Клуб хаагдсан байна.',
  };
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
  return [...members, ...parents].map((row) => row.fcmToken).filter(Boolean);
}

async function notifyClubStatus(open) {
  const isOpen = Boolean(open);
  const { title, body } = clubStatusCopy(isOpen);

  try {
    await Notice.create({ title, body, published: true });
  } catch (err) {
    console.error('FCM: failed to create club notice', err);
  }

  if (!isPushConfigured()) {
    console.warn('FCM: club status not broadcast — Firebase is not configured');
    return { skipped: true };
  }

  const payload = {
    title,
    body,
    data: { type: 'club', open: isOpen ? 'true' : 'false' },
  };

  const result = { skipped: false, topic: null, tokens: null };

  try {
    result.topic = await sendToTopic(CLUB_TOPIC, payload);
  } catch (err) {
    console.error('FCM: club topic send failed', err);
  }

  try {
    const tokens = await collectDeviceTokens();
    result.tokens = await sendToTokens(tokens, payload);
    console.log(
      `FCM: club ${isOpen ? 'open' : 'closed'} topic=${CLUB_TOPIC} tokens=${result.tokens.successCount}/${tokens.length}`,
    );
  } catch (err) {
    console.error('FCM: club token send failed', err);
  }

  return result;
}

module.exports = { notifyClubStatus, clubStatusCopy, CLUB_TOPIC };
