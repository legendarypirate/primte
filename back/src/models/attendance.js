const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  kind: { type: DataTypes.ENUM('club', 'training'), defaultValue: 'club' },
  title: { type: DataTypes.STRING, defaultValue: 'Клубт ирсэн' },
  note: { type: DataTypes.STRING },
  checkOutAt: { type: DataTypes.DATE, allowNull: true, field: 'check_out_at' },
});

module.exports = Attendance;
