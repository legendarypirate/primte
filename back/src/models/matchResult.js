const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchResult = sequelize.define(
  'MatchResult',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    competitorId: { type: DataTypes.UUID, allowNull: false, field: 'competitor_id' },
    divisionId: { type: DataTypes.UUID, field: 'division_id' },
    matchPoints: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'match_points' },
    matchPercentage: { type: DataTypes.DECIMAL(16, 8), defaultValue: 0, field: 'match_percentage' },
    rank: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'match_results',
    underscored: true,
    indexes: [
      { fields: ['match_id', 'division_id'] },
      { fields: ['match_id', 'competitor_id'], unique: true },
    ],
  }
);

module.exports = MatchResult;
