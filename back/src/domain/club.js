const CLUB_TIME_ZONE = 'Asia/Ulaanbaatar';

const WEEKDAY_LABELS = {
  1: 'Даваа',
  2: 'Мягмар',
  3: 'Лхагва',
  4: 'Пүрэв',
  5: 'Баасан',
  6: 'Бямба',
  7: 'Ням',
};

const DEFAULT_START = '10:00';
const DEFAULT_END = '22:00';

function startOfClubDay(now = new Date(), timeZone = CLUB_TIME_ZONE) {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return new Date(`${day}T00:00:00+08:00`);
}

function clubWeekday(now = new Date(), timeZone = CLUB_TIME_ZONE) {
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' }).format(now);
  return { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[weekday] || 1;
}

function normalizeClock(value, fallback = DEFAULT_START) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return fallback;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour > 23 || minute > 59) return fallback;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function defaultClubHour(weekday) {
  return { weekday, open: true, start: DEFAULT_START, end: DEFAULT_END };
}

function normalizeClubHours(hours) {
  const byDay = new Map();
  if (Array.isArray(hours)) {
    for (const row of hours) {
      const weekday = Number(row?.weekday);
      if (!Number.isInteger(weekday) || weekday < 1 || weekday > 7) continue;
      const start = normalizeClock(row.start, DEFAULT_START);
      let end = normalizeClock(row.end, DEFAULT_END);
      if (end <= start) end = start < DEFAULT_END ? DEFAULT_END : '23:59';
      byDay.set(weekday, {
        weekday,
        open: row.open !== false,
        start,
        end,
      });
    }
  }
  return [1, 2, 3, 4, 5, 6, 7].map((weekday) => byDay.get(weekday) || defaultClubHour(weekday));
}

function serializeClubHours(hours, now = new Date()) {
  const today = clubWeekday(now);
  return normalizeClubHours(hours).map((row) => ({
    ...row,
    label: WEEKDAY_LABELS[row.weekday],
    today: row.weekday === today,
  }));
}

function mergeClubStatus(setting = {}, { todayCount = 0, now = new Date() } = {}) {
  const capacityRaw = Number(setting.capacity);
  const todayRaw = Number(todayCount);
  return {
    open: setting.open !== false,
    todayCount: Number.isFinite(todayRaw) ? Math.max(0, Math.round(todayRaw)) : 0,
    capacity: Number.isFinite(capacityRaw) && capacityRaw > 0 ? Math.round(capacityRaw) : 40,
    hours: serializeClubHours(setting.hours, now),
  };
}

function clubTime(value, timeZone = CLUB_TIME_ZONE) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

module.exports = {
  CLUB_TIME_ZONE,
  WEEKDAY_LABELS,
  DEFAULT_START,
  DEFAULT_END,
  startOfClubDay,
  clubWeekday,
  normalizeClock,
  normalizeClubHours,
  serializeClubHours,
  mergeClubStatus,
  clubTime,
};
