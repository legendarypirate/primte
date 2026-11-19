const { broadcastToAllUsers } = require('./pushBroadcast');

async function notifyPublishedNotice(notice) {
  const title = String(notice.title || '').trim();
  const body = String(notice.body || '').trim();
  if (!title) return { skipped: true, successCount: 0, failureCount: 0, tokenCount: 0 };

  return broadcastToAllUsers({
    title,
    body: body || title,
    data: { type: 'notice', noticeId: String(notice.id || '') },
  });
}

module.exports = { notifyPublishedNotice };
