function normalizeMemberCode(value) {
  return String(value || '').trim();
}

function memberCodesEqual(a, b) {
  const left = normalizeMemberCode(a);
  const right = normalizeMemberCode(b);
  if (!left || !right) return false;
  return left.toLowerCase() === right.toLowerCase();
}

function pinCandidates(value) {
  const code = normalizeMemberCode(value);
  if (!code) return [];
  return [...new Set([code, code.toUpperCase(), code.toLowerCase()])];
}

async function memberCodeUnlocks(member, entered, compareHash) {
  const code = normalizeMemberCode(entered);
  if (!member || !code) return false;
  if (memberCodesEqual(code, member.memberCode)) return true;
  if (!member.pinHash || typeof compareHash !== 'function') return false;
  for (const candidate of pinCandidates(code)) {
    if (await compareHash(candidate, member.pinHash)) return true;
  }
  return false;
}

module.exports = {
  normalizeMemberCode,
  memberCodesEqual,
  pinCandidates,
  memberCodeUnlocks,
};
