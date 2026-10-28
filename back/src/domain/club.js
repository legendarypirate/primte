const CLUB_TIME_ZONE = 'Asia/Ulaanbaatar';

function startOfClubDay(now = new Date(), timeZone = CLUB_TIME_ZONE) {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return new Date(`${day}T00:00:00+08:00`);
}

function mergeClubStatus(setting = {}, { todayCount = 0 } = {}) {
  const capacityRaw = Number(setting.capacity);
  const todayRaw = Number(todayCount);
  return {
    open: setting.open !== false,
    todayCount: Number.isFinite(todayRaw) ? Math.max(0, Math.round(todayRaw)) : 0,
    capacity: Number.isFinite(capacityRaw) && capacityRaw > 0 ? Math.round(capacityRaw) : 40,
  };
}

module.exports = {
  CLUB_TIME_ZONE,
  startOfClubDay,
  mergeClubStatus,
};
