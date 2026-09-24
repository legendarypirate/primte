const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchDivision = sequelize.define(
  'MatchDivision',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    divisionId: { type: DataTypes.UUID, field: 'division_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'match_divisions', underscored: true, indexes: [{ fields: ['match_id'] }, { fields: ['match_id', 'code'], unique: true }] }
);

module.exports = MatchDivision;
