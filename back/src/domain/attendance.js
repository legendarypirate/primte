const crypto = require('crypto');

const GATE_PREFIX = 'PRIME-GATE';
const GATE_TTL_MS = 90 * 1000;

function attendanceHours(checkIn, checkOut) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.floor((end - start) / (60 * 60 * 1000));
}

function gateSecret() {
  return process.env.JWT_SECRET || 'prime-club-jwt-secret-change-me';
}

function signGate(direction, ts) {
  return crypto.createHmac('sha256', gateSecret()).update(`${GATE_PREFIX}|${direction}|${ts}`).digest('hex').slice(0, 20);
}

function makeGatePayload(direction, now = Date.now()) {
  const dir = direction === 'OUT' ? 'OUT' : 'IN';
  const ts = Number(now);
  return `${GATE_PREFIX}|${dir}|${ts}|${signGate(dir, ts)}`;
}

function parseGatePayload(payload, now = Date.now()) {
  const parts = String(payload || '').trim().split('|');
  if (parts.length !== 4 || parts[0] !== GATE_PREFIX) return null;
  const direction = parts[1];
  const ts = Number(parts[2]);
  const sig = parts[3];
  if (direction !== 'IN' && direction !== 'OUT') return null;
  if (!Number.isFinite(ts) || Math.abs(Number(now) - ts) > GATE_TTL_MS) return null;
  if (sig !== signGate(direction, ts)) return null;
  return direction;
}

module.exports = {
  GATE_PREFIX,
  GATE_TTL_MS,
  attendanceHours,
  makeGatePayload,
  parseGatePayload,
};
