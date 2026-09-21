const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
  kind: { type: DataTypes.ENUM('admin'), allowNull: false, defaultValue: 'admin' },
  isSuper: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_super' },
  isSystem: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_system' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
  permissions: { type: DataTypes.JSONB, defaultValue: [] },
});

module.exports = Role;
