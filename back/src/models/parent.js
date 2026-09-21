const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  pinHash: { type: DataTypes.STRING, allowNull: false, field: 'pin_hash' },
  email: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING, field: 'avatar_url' },
});

module.exports = Parent;
