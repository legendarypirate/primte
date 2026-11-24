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

function isNonMemberType(type) {
  return type?.slug === 'non-member' || type?.category === 'non-member';
}

function membershipLabel(level, category) {
  if (category === 'non-member') return 'Non member';
  if (category === 'junior') {
    const n = Math.max(1, Number(level) || 1);
    return `Junior L${n} member`;
  }
  if (!level) return 'Student member';
  return `Level ${level} member`;
}

function membershipDisplayLabel(type, xp = 0, rp = 0) {
  if (type?.name) return type.name;
  const category = type?.category || null;
  if (category === 'junior') return membershipLabel(type?.level || 1, category);
  return membershipLabel(computeMembershipLevel(xp, rp), category);
}

function membershipDisplayLevel(type, xp = 0, rp = 0) {
  const category = type?.category || null;
  if (category === 'non-member') return 0;
  if (category === 'junior') return Math.max(1, Number(type?.level) || 1);
  const computed = computeMembershipLevel(xp, rp);
  const typed = Number(type?.level);
  return Math.max(computed, Number.isFinite(typed) ? typed : 0);
}

function toDelta(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function addExperience(current = {}, delta = {}) {
  // XP only goes up. RP can move either way, but never below zero.
  const xp = toInt(current.xp) + Math.max(0, toDelta(delta.xp));
  const rp = Math.max(0, toInt(current.rp) + toDelta(delta.rp));
  return { xp, rp, level: computeMembershipLevel(xp, rp) };
}

module.exports = {
  THRESHOLDS,
  toInt,
  toDelta,
  computeMembershipLevel,
  membershipLabel,
  membershipDisplayLabel,
  membershipDisplayLevel,
  isNonMemberType,
  addExperience,
};
