const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Training = sequelize.define('Training', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subtitle: { type: DataTypes.STRING },
  eventDate: { type: DataTypes.DATEONLY, field: 'event_date' },
  timeLabel: { type: DataTypes.STRING, field: 'time_label' },
  imageUrl: { type: DataTypes.STRING, field: 'image_url' },
  capacity: { type: DataTypes.INTEGER, defaultValue: 24 },
  fee: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Training;
