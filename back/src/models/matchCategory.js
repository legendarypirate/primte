const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchCategory = sequelize.define(
  'MatchCategory',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'match_categories', underscored: true, indexes: [{ fields: ['match_id'] }] }
);

module.exports = MatchCategory;
