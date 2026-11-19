const { Notice } = require('../models');
const { broadcastToAllUsers, CLUB_TOPIC } = require('./pushBroadcast');

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

async function notifyClubStatus(open) {
  const isOpen = Boolean(open);
  const { title, body } = clubStatusCopy(isOpen);

  try {
    await Notice.create({ title, body, published: true });
  } catch (err) {
    console.error('FCM: failed to create club notice', err);
  }

  return broadcastToAllUsers({
    title,
    body,
    data: { type: 'club', open: isOpen ? 'true' : 'false' },
  });
}

module.exports = { notifyClubStatus, clubStatusCopy, CLUB_TOPIC };
