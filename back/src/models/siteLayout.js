const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteLayout = sequelize.define(
  'SiteLayout',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    header: { type: DataTypes.JSONB, defaultValue: {} },
    footer: { type: DataTypes.JSONB, defaultValue: {} },
  },
  { tableName: 'site_layout' }
);

module.exports = SiteLayout;
