const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  pinHash: { type: DataTypes.STRING, allowNull: false, field: 'pin_hash' },
  passwordHash: { type: DataTypes.STRING, allowNull: true, field: 'password_hash' },
  email: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING, field: 'avatar_url' },
  fcmToken: { type: DataTypes.TEXT, allowNull: true, field: 'fcm_token' },
  fcmPlatform: { type: DataTypes.STRING, allowNull: true, field: 'fcm_platform' },
});

module.exports = Parent;
