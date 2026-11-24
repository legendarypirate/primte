const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notice = sequelize.define('Notice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  published: { type: DataTypes.BOOLEAN, defaultValue: true },
  memberTypeIds: { type: DataTypes.JSONB, defaultValue: [], field: 'member_type_ids' },
});

module.exports = Notice;
