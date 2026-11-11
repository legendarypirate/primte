const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MemberDevelopmentActivity = sequelize.define('MemberDevelopmentActivity', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  developmentActivityId: { type: DataTypes.UUID, allowNull: false, field: 'development_activity_id' },
}, {
  tableName: 'member_development_activities',
  indexes: [{ unique: true, fields: ['member_id', 'development_activity_id'] }],
});

module.exports = MemberDevelopmentActivity;
