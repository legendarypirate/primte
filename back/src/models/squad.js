const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Squad = sequelize.define(
  'Squad',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    startTime: { type: DataTypes.DATE, field: 'start_time' },
    endTime: { type: DataTypes.DATE, field: 'end_time' },
    capacity: { type: DataTypes.INTEGER, defaultValue: 20 },
    status: {
      type: DataTypes.ENUM('WAITING', 'ACTIVE', 'COMPLETED'),
      defaultValue: 'WAITING',
    },
  },
  { tableName: 'squads', underscored: true, indexes: [{ fields: ['match_id'] }] }
);

module.exports = Squad;
