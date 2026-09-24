const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SyncOperation = sequelize.define(
  'SyncOperation',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    entityType: { type: DataTypes.STRING, allowNull: false, field: 'entity_type' },
    entityId: { type: DataTypes.UUID, field: 'entity_id' },
    action: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.JSONB, allowNull: false },
    syncStatus: {
      type: DataTypes.ENUM('PENDING', 'SYNCING', 'SYNCED', 'CONFLICT', 'FAILED'),
      defaultValue: 'PENDING',
      field: 'sync_status',
    },
    deviceId: { type: DataTypes.STRING, field: 'device_id' },
    errorMessage: { type: DataTypes.TEXT, field: 'error_message' },
  },
  { tableName: 'sync_operations', underscored: true, indexes: [{ fields: ['sync_status'] }, { fields: ['device_id'] }] }
);

module.exports = SyncOperation;
