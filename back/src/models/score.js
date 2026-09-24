const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Score = sequelize.define(
  'Score',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    stageId: { type: DataTypes.UUID, allowNull: false, field: 'stage_id' },
    competitorId: { type: DataTypes.UUID, allowNull: false, field: 'competitor_id' },
    timeSeconds: { type: DataTypes.DECIMAL(10, 4), allowNull: false, field: 'time_seconds' },
    alphaHits: { type: DataTypes.INTEGER, defaultValue: 0, field: 'alpha_hits' },
    charlieHits: { type: DataTypes.INTEGER, defaultValue: 0, field: 'charlie_hits' },
    deltaHits: { type: DataTypes.INTEGER, defaultValue: 0, field: 'delta_hits' },
    missCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'miss_count' },
    noShootCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'no_shoot_count' },
    proceduralCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'procedural_count' },
    otherPenaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0, field: 'other_penalty_points' },
    hitPoints: { type: DataTypes.INTEGER, defaultValue: 0, field: 'hit_points' },
    penaltyPoints: { type: DataTypes.INTEGER, defaultValue: 0, field: 'penalty_points' },
    pointsAfterPenalty: { type: DataTypes.INTEGER, defaultValue: 0, field: 'points_after_penalty' },
    effectivePoints: { type: DataTypes.INTEGER, defaultValue: 0, field: 'effective_points' },
    hitFactor: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'hit_factor' },
    status: {
      type: DataTypes.ENUM('DRAFT', 'ENTERED', 'CONFIRMED', 'SIGNED', 'INVALIDATED'),
      defaultValue: 'DRAFT',
    },
    enteredBy: { type: DataTypes.UUID, field: 'entered_by' },
    signedAt: { type: DataTypes.DATE, field: 'signed_at' },
    signedBy: { type: DataTypes.UUID, field: 'signed_by' },
    deviceId: { type: DataTypes.STRING, field: 'device_id' },
    version: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: 'scores',
    underscored: true,
    indexes: [
      { fields: ['match_id'] },
      { fields: ['stage_id'] },
      { fields: ['competitor_id'] },
      { fields: ['stage_id', 'competitor_id'] },
    ],
  }
);

module.exports = Score;
