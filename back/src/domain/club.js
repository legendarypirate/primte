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

function clubDateKey(now = new Date(), timeZone = CLUB_TIME_ZONE) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function startOfClubDay(now = new Date(), timeZone = CLUB_TIME_ZONE) {
  return new Date(`${clubDateKey(now, timeZone)}T00:00:00+08:00`);
}

function shiftClubDate(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00+08:00`);
  date.setTime(date.getTime() + Number(days) * 24 * 60 * 60 * 1000);
  return clubDateKey(date);
}

function normalizeDateKey(value) {
  const raw = String(value || '').trim().replace(/\./g, '-');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const date = new Date(`${raw}T12:00:00+08:00`);
  if (Number.isNaN(date.getTime()) || clubDateKey(date) !== raw) return null;
  return raw;
}

function formatClubDateLabel(dateKey) {
  const [year, month, day] = String(dateKey).split('-');
  if (!year || !month || !day) return String(dateKey || '');
  return `${year}.${month}.${day}`;
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

function normalizeHourRange(row = {}) {
  const start = normalizeClock(row.start, DEFAULT_START);
  let end = normalizeClock(row.end, DEFAULT_END);
  if (end <= start) end = start < DEFAULT_END ? DEFAULT_END : '23:59';
  return { open: row.open !== false, start, end };
}

function normalizeClubDates(dates, { fromDate } = {}) {
  const byDate = new Map();
  if (Array.isArray(dates)) {
    for (const row of dates) {
      const date = normalizeDateKey(row?.date);
      if (!date) continue;
      if (fromDate && date < fromDate) continue;
      byDate.set(date, { date, ...normalizeHourRange(row) });
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function resolveDayHours(setting = {}, dateKey) {
  const weekday = clubWeekday(new Date(`${dateKey}T12:00:00+08:00`));
  const weekly = normalizeClubHours(setting.hours).find((row) => row.weekday === weekday) || defaultClubHour(weekday);
  const override = normalizeClubDates(setting.dates).find((row) => row.date === dateKey);
  const source = override || weekly;
  return {
    date: dateKey,
    weekday,
    label: WEEKDAY_LABELS[weekday],
    dateLabel: formatClubDateLabel(dateKey),
    open: source.open,
    start: source.start,
    end: source.end,
    special: Boolean(override),
  };
}

function serializeUpcomingHours(setting = {}, now = new Date()) {
  const today = clubDateKey(now);
  return [0, 1, 2, 3, 4, 5, 6].map((offset) => ({
    ...resolveDayHours(setting, shiftClubDate(today, offset)),
    today: offset === 0,
  }));
}

function mergeClubStatus(setting = {}, { todayCount = 0, now = new Date() } = {}) {
  const capacityRaw = Number(setting.capacity);
  const todayRaw = Number(todayCount);
  const today = clubDateKey(now);
  return {
    open: setting.open !== false,
    todayCount: Number.isFinite(todayRaw) ? Math.max(0, Math.round(todayRaw)) : 0,
    capacity: Number.isFinite(capacityRaw) && capacityRaw > 0 ? Math.round(capacityRaw) : 40,
    hours: serializeUpcomingHours(setting, now),
    weeklyHours: serializeClubHours(setting.hours, now),
    dates: normalizeClubDates(setting.dates, { fromDate: today }),
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
  clubDateKey,
  startOfClubDay,
  shiftClubDate,
  normalizeDateKey,
  clubWeekday,
  normalizeClock,
  normalizeClubHours,
  normalizeClubDates,
  serializeClubHours,
  serializeUpcomingHours,
  mergeClubStatus,
  clubTime,
};
