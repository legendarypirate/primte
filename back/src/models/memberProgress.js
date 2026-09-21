const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberProgress = sequelize.define('MemberProgress', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  accuracy: { type: DataTypes.INTEGER, defaultValue: 0 },
  speed: { type: DataTypes.INTEGER, defaultValue: 0 },
  stability: { type: DataTypes.INTEGER, defaultValue: 0 },
  tactical: { type: DataTypes.INTEGER, defaultValue: 0 },
  safety: { type: DataTypes.INTEGER, defaultValue: 0 },
  period: { type: DataTypes.STRING, defaultValue: '3m' },
  accuracyDelta: { type: DataTypes.INTEGER, defaultValue: 0, field: 'accuracy_delta' },
});

module.exports = MemberProgress;
