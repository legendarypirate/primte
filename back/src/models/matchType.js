const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MatchType = sequelize.define('MatchType', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.STRING },
});

module.exports = MatchType;
