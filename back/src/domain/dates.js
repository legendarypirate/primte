const MEMBERSHIP_TERM_MONTHS = 3;

function pad2(n) {
  return String(n).padStart(2, '0');
}

function todayDateOnly(now = new Date()) {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function addMonthsDateOnly(iso, months) {
  const base = toDateOnly(iso) || todayDateOnly();
  const [year, month, day] = base.split('-').map(Number);
  const date = new Date(year, month - 1 + Number(months || 0), day);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toDateOnly(value, fallback = null) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return fallback;
  const raw = String(value).trim();
  if (!raw || /^invalid date$/i.test(raw)) return fallback;
  const match = raw.match(/^(\d{4})[.\-/](\d{2})[.\-/](\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : fallback;
}

function membershipDates(validFrom, validTo, now = new Date()) {
  const from = toDateOnly(validFrom, todayDateOnly(now));
  return {
    validFrom: from,
    validTo: toDateOnly(validTo, addMonthsDateOnly(from, MEMBERSHIP_TERM_MONTHS)),
  };
}

module.exports = {
  MEMBERSHIP_TERM_MONTHS,
  todayDateOnly,
  addMonthsDateOnly,
  toDateOnly,
  membershipDates,
};
