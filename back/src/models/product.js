const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'accessory' },
  categoryLabel: { type: DataTypes.STRING, field: 'category_label' },
  subtitle: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  features: { type: DataTypes.JSONB, defaultValue: [] },
  relatedIds: { type: DataTypes.JSONB, defaultValue: [], field: 'related_ids' },
  inStock: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'in_stock' },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0, field: 'sort_order' },
});

module.exports = Product;
