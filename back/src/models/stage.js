const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stage = sequelize.define(
  'Stage',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    number: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    courseType: {
      type: DataTypes.ENUM('SHORT', 'MEDIUM', 'LONG', 'CUSTOM'),
      defaultValue: 'SHORT',
      field: 'course_type',
    },
    minimumRounds: { type: DataTypes.INTEGER, defaultValue: 0, field: 'minimum_rounds' },
    maximumPoints: { type: DataTypes.INTEGER, defaultValue: 100, field: 'maximum_points' },
    paperTargetCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'paper_target_count' },
    metalTargetCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'metal_target_count' },
    noShootCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'no_shoot_count' },
    scoringHitsPerTarget: { type: DataTypes.INTEGER, defaultValue: 2, field: 'scoring_hits_per_target' },
    status: {
      type: DataTypes.ENUM('WAITING', 'ACTIVE', 'COMPLETED'),
      defaultValue: 'WAITING',
    },
  },
  { tableName: 'stages', underscored: true, indexes: [{ fields: ['match_id'] }, { fields: ['match_id', 'number'], unique: true }] }
);

module.exports = Stage;
