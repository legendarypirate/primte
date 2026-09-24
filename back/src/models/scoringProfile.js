const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScoringProfile = sequelize.define(
  'ScoringProfile',
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    powerFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'power_factor_enabled' },
    major: { type: DataTypes.JSONB, allowNull: false },
    minor: { type: DataTypes.JSONB, allowNull: false },
    missPenalty: { type: DataTypes.INTEGER, defaultValue: 10, field: 'miss_penalty' },
    noShootPenalty: { type: DataTypes.INTEGER, defaultValue: 10, field: 'no_shoot_penalty' },
    proceduralPenalty: { type: DataTypes.INTEGER, defaultValue: 10, field: 'procedural_penalty' },
    minimumStagePoints: { type: DataTypes.INTEGER, defaultValue: 0, field: 'minimum_stage_points' },
    hitFactorDisplayPrecision: { type: DataTypes.INTEGER, defaultValue: 4, field: 'hf_display_precision' },
    stagePointsDisplayPrecision: { type: DataTypes.INTEGER, defaultValue: 4, field: 'sp_display_precision' },
    percentageDisplayPrecision: { type: DataTypes.INTEGER, defaultValue: 2, field: 'pct_display_precision' },
  },
  { tableName: 'scoring_profiles', underscored: true }
);

module.exports = ScoringProfile;
