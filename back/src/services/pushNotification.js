const fs = require('node:fs');
const admin = require('firebase-admin');

let messaging = null;

function loadServiceAccount() {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (inline) {
    return JSON.parse(inline);
  }

  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (path && fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  return null;
}

function initPushNotifications() {
  if (messaging) return true;

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    console.warn(
      'FCM: Firebase service account not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.',
    );
    return false;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  messaging = admin.messaging();
  console.log('FCM: push notification service ready');
  return true;
}

function isPushConfigured() {
  return messaging != null;
}

function normalizeData(data = {}) {
  const out = {};
  for (const [key, value] of Object.entries(data)) {
    if (value == null) continue;
    out[key] = typeof value === 'string' ? value : JSON.stringify(value);
  }
  return out;
}

function buildPayload({ title, body, data = {} }) {
  return {
    notification: { title, body },
    data: normalizeData(data),
    android: { priority: 'high' },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };
}

async function sendToTokens(tokens, payload) {
  if (!messaging) {
    throw new Error('FCM is not configured on the server');
  }

  const uniqueTokens = [...new Set(tokens.filter(Boolean))];
  if (uniqueTokens.length === 0) {
    return { successCount: 0, failureCount: 0, responses: [] };
  }

  const response = await messaging.sendEachForMulticast({
    tokens: uniqueTokens,
    ...buildPayload(payload),
  });

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    responses: response.responses.map((item, index) => ({
      token: uniqueTokens[index],
      success: item.success,
      error: item.error?.message || null,
    })),
  };
}

async function sendToTopic(topic, payload) {
  if (!messaging) {
    throw new Error('FCM is not configured on the server');
  }
  const messageId = await messaging.send({
    topic,
    ...buildPayload(payload),
  });
  return { messageId };
}

module.exports = {
  initPushNotifications,
  isPushConfigured,
  sendToTokens,
  sendToTopic,
};
