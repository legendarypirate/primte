const { Attendance } = require('../models');
const { attendanceHours } = require('../domain/attendance');
const { startOfClubDay } = require('../domain/club');
const { awardTrainingHourXp } = require('./pointLedger');

async function openSession(memberId) {
  return Attendance.findOne({
    where: { memberId, checkOutAt: null },
    order: [['createdAt', 'DESC']],
  });
}

function fail(message, statusCode = 409) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

function clubTime(value) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ulaanbaatar',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

async function closeSession(member, open, checkOutAt) {
  const hours = attendanceHours(open.createdAt, checkOutAt);
  await open.update({
    checkOutAt,
    title: hours >= 1 ? `Клубт ${hours} цаг` : 'Клубт ирсэн',
    note: `${clubTime(open.createdAt)}–${clubTime(checkOutAt)}`,
  });
  await open.reload();
  let xpAwarded = 0;
  if (hours >= 1) {
    const awarded = await awardTrainingHourXp(member, open, { hours });
    if (awarded) xpAwarded = hours;
  }
  return { hours, xpAwarded, attendance: open };
}

async function checkIn(member) {
  const open = await openSession(member.id);
  if (open) {
    const todayStart = startOfClubDay();
    if (new Date(open.createdAt) >= todayStart) {
      fail('Та аль хэдийн ирсэн бүртгэлтэй байна. Явсан QR-ээ уншуулна уу.');
    }
    await closeSession(member, open, todayStart);
  }
  const row = await Attendance.create({
    memberId: member.id,
    kind: 'club',
    title: 'Клубт ирсэн',
    note: 'QR ирц',
  });
  return {
    action: 'check_in',
    message: 'Ирсэн цаг бүртгэгдлээ.',
    hours: 0,
    xpAwarded: 0,
    attendance: row,
  };
}

async function checkOut(member) {
  const open = await openSession(member.id);
  if (!open) fail('Ирсэн бүртгэл олдсонгүй. Эхлээд ирсэн QR-ээ уншуулна уу.');
  const closed = await closeSession(member, open, new Date());
  const { hours, xpAwarded } = closed;
  return {
    action: 'check_out',
    message: hours >= 1
      ? `Явсан бүртгэгдлээ. ${hours} цаг = +${hours} XP`
      : 'Явсан бүртгэгдлээ. 1 цаг хүрээгүй тул XP нэмэгдсэнгүй.',
    hours,
    xpAwarded,
    attendance: closed.attendance,
  };
}

async function applyGate(member, direction) {
  if (direction === 'OUT') return checkOut(member);
  return checkIn(member);
}

function serializeSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    arrivedAt: row.createdAt,
    checkOutAt: row.checkOutAt,
    hours: row.checkOutAt ? attendanceHours(row.createdAt, row.checkOutAt) : 0,
    title: row.title,
  };
}

module.exports = {
  openSession,
  checkIn,
  checkOut,
  applyGate,
  serializeSession,
};
