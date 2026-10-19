const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberPointEvent = sequelize.define('MemberPointEvent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  kind: { type: DataTypes.ENUM('xp', 'rp'), allowNull: false },
  source: {
    type: DataTypes.ENUM(
      'training_hour',
      'training_match',
      'competition',
      'rating',
      'admin',
      'opening'
    ),
    allowNull: false,
    defaultValue: 'admin',
  },
  delta: { type: DataTypes.INTEGER, allowNull: false },
  balanceAfter: { type: DataTypes.INTEGER, allowNull: false, field: 'balance_after' },
  title: { type: DataTypes.STRING, allowNull: false },
  note: { type: DataTypes.STRING, allowNull: true },
  refType: { type: DataTypes.STRING, allowNull: true, field: 'ref_type' },
  refId: { type: DataTypes.UUID, allowNull: true, field: 'ref_id' },
}, {
  tableName: 'member_point_events',
  indexes: [
    { fields: ['member_id', 'created_at'] },
    { fields: ['member_id', 'kind'] },
    { fields: ['member_id', 'source', 'ref_id'] },
  ],
});

module.exports = MemberPointEvent;
