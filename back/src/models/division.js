const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Division = sequelize.define('Division', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  abbreviation: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

module.exports = Division;
