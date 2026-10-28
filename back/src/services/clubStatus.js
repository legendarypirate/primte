const { Op } = require('sequelize');
const { Attendance, Setting } = require('../models');
const { startOfClubDay, mergeClubStatus } = require('../domain/club');

async function loadClubStatus() {
  const [row, todayCount] = await Promise.all([
    Setting.findByPk('club'),
    Attendance.count({
      distinct: true,
      col: 'memberId',
      where: { checkOutAt: null, createdAt: { [Op.gte]: startOfClubDay() } },
    }),
  ]);
  return mergeClubStatus(row?.value || {}, { todayCount });
}

module.exports = { loadClubStatus };
