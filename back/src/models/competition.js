const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competition = sequelize.define('Competition', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING },
  eventDate: { type: DataTypes.DATEONLY, field: 'event_date' },
  location: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  capacity: { type: DataTypes.INTEGER, defaultValue: 50 },
  fee: { type: DataTypes.INTEGER, defaultValue: 0 },
  about: { type: DataTypes.TEXT },
  facts: { type: DataTypes.JSONB, defaultValue: [] },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  status: { type: DataTypes.ENUM('upcoming', 'open', 'past'), defaultValue: 'upcoming' },
});

module.exports = Competition;
