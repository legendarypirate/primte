function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('976') && digits.length === 11) return digits.slice(3);
  return digits;
}

function formatPhone(phone) {
  const digits = normalizePhone(phone);
  if (digits.length === 8) return `+976 ${digits.slice(0, 4)}-${digits.slice(4)}`;
  return String(phone || '').trim();
}

function isValidMnPhone(phone) {
  return /^[6-9]\d{7}$/.test(normalizePhone(phone));
}

function phoneCandidates(phone) {
  const raw = String(phone || '').trim();
  const digits = normalizePhone(phone);
  const last8 = digits.length >= 8 ? digits.slice(-8) : digits;
  return [...new Set([
    raw,
    digits,
    last8,
    `+976${digits}`,
    `976${digits}`,
    `+976${last8}`,
    `976${last8}`,
    formatPhone(digits),
  ].filter(Boolean))];
}

module.exports = {
  normalizePhone,
  formatPhone,
  isValidMnPhone,
  phoneCandidates,
};
