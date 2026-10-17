const THRESHOLDS = {
  level1Xp: 50,
  level2Rp: 150,
  level3Xp: 200,
  level3Rp: 600,
};

function toInt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

function computeMembershipLevel(xp = 0, rp = 0) {
  const x = toInt(xp);
  const r = toInt(rp);
  if (x > THRESHOLDS.level3Xp && r > THRESHOLDS.level3Rp) return 3;
  if (x > THRESHOLDS.level1Xp && r > THRESHOLDS.level2Rp) return 2;
  if (x > THRESHOLDS.level1Xp) return 1;
  return 0;
}

function membershipLabel(level) {
  if (!level) return 'Student member';
  return `Level ${level} member`;
}

module.exports = {
  THRESHOLDS,
  toInt,
  computeMembershipLevel,
  membershipLabel,
};
