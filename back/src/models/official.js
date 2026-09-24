const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Official = sequelize.define(
  'Official',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    adminId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'admin_id' },
    role: {
      type: DataTypes.ENUM(
        'ATHLETE',
        'RO',
        'SCOREKEEPER',
        'MATCH_DIRECTOR',
        'RANGE_MASTER',
        'STATS_ADMIN',
        'SUPER_ADMIN'
      ),
      defaultValue: 'RO',
    },
    pinHash: { type: DataTypes.STRING, field: 'pin_hash' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'officials', underscored: true }
);

module.exports = Official;
