const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    actorId: { type: DataTypes.UUID, field: 'actor_id' },
    action: { type: DataTypes.STRING, allowNull: false },
    entityType: { type: DataTypes.STRING, allowNull: false, field: 'entity_type' },
    entityId: { type: DataTypes.UUID, field: 'entity_id' },
    before: { type: DataTypes.JSONB },
    after: { type: DataTypes.JSONB },
    deviceId: { type: DataTypes.STRING, field: 'device_id' },
  },
  { tableName: 'audit_logs', underscored: true, indexes: [{ fields: ['entity_type', 'entity_id'] }] }
);

module.exports = AuditLog;
