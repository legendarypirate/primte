const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SitePage = sequelize.define(
  'SitePage',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    metaTitle: { type: DataTypes.STRING, allowNull: true },
    metaDescription: { type: DataTypes.TEXT, allowNull: true },
    published: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
    blocks: { type: DataTypes.JSONB, defaultValue: [] },
    content: { type: DataTypes.JSONB, defaultValue: {} },
  },
  { tableName: 'site_pages' }
);

module.exports = SitePage;
