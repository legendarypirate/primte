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
    certificationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'LEVEL_I_RO',
      field: 'certification_level',
    },
    trainingAroHours: { type: DataTypes.FLOAT, defaultValue: 0, field: 'training_aro_hours' },
    trainingRoHours: { type: DataTypes.FLOAT, defaultValue: 0, field: 'training_ro_hours' },
    clubL1AroHours: { type: DataTypes.FLOAT, defaultValue: 0, field: 'club_l1_aro_hours' },
    annualHoursYtd: { type: DataTypes.FLOAT, defaultValue: 0, field: 'annual_hours_ytd' },
    competitionId: { type: DataTypes.UUID, allowNull: true, field: 'competition_id' },
    memberId: { type: DataTypes.UUID, allowNull: true, unique: true, field: 'member_id' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'judges', underscored: true }
);

module.exports = Judge;
