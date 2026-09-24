const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StageResult = sequelize.define(
  'StageResult',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    stageId: { type: DataTypes.UUID, allowNull: false, field: 'stage_id' },
    competitorId: { type: DataTypes.UUID, allowNull: false, field: 'competitor_id' },
    divisionId: { type: DataTypes.UUID, field: 'division_id' },
    hitFactor: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'hit_factor' },
    bestHitFactor: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'best_hit_factor' },
    stagePoints: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'stage_points' },
    stagePercentage: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'stage_percentage' },
    rank: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'stage_results',
    underscored: true,
    indexes: [
      { fields: ['match_id', 'stage_id', 'division_id'] },
      { fields: ['stage_id', 'competitor_id'], unique: true },
    ],
  }
);

module.exports = StageResult;
