const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DevelopmentActivity = sequelize.define('DevelopmentActivity', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
  isSystem: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_system' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
});

module.exports = DevelopmentActivity;
