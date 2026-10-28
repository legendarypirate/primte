const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Judge = sequelize.define(
  'Judge',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    name: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('RO', 'SCOREKEEPER', 'RANGE_MASTER', 'MATCH_DIRECTOR'),
      defaultValue: 'RO',
    },
    competitionId: { type: DataTypes.UUID, allowNull: true, field: 'competition_id' },
    memberId: { type: DataTypes.UUID, allowNull: true, unique: true, field: 'member_id' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'judges', underscored: true }
);

module.exports = Judge;
