const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberType = sequelize.define('MemberType', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'official' },
  level: { type: DataTypes.INTEGER, allowNull: true },
  isInactive: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_inactive' },
  requiresParent: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'requires_parent' },
  hasAppAccess: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'has_app_access' },
  isSystem: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_system' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
});

module.exports = MemberType;
