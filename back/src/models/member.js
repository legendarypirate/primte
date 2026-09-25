const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: true, unique: true },
  memberCode: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'member_code' },
  pinHash: { type: DataTypes.STRING, allowNull: false, field: 'pin_hash' },
  passwordHash: { type: DataTypes.STRING, allowNull: true, field: 'password_hash' },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  birthday: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.STRING },
  classification: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING, field: 'avatar_url' },
  motto: { type: DataTypes.STRING, defaultValue: 'Багтай бай. Илүү хол явна.' },
  level: { type: DataTypes.INTEGER, defaultValue: 1 },
  rank: { type: DataTypes.INTEGER, defaultValue: 0 },
  competitionCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'competition_count' },
  validFrom: { type: DataTypes.DATEONLY, field: 'valid_from' },
  validTo: { type: DataTypes.DATEONLY, field: 'valid_to' },
  status: { type: DataTypes.ENUM('active', 'inactive', 'expired'), defaultValue: 'active' },
  walletBalance: { type: DataTypes.INTEGER, defaultValue: 0, field: 'wallet_balance' },
  memberTypeId: { type: DataTypes.UUID, allowNull: true, field: 'member_type_id' },
  developmentActivityId: { type: DataTypes.UUID, allowNull: true, field: 'development_activity_id' },
  parentId: { type: DataTypes.UUID, allowNull: true, field: 'parent_id' },
  parentAccountId: { type: DataTypes.UUID, allowNull: true, field: 'parent_account_id' },
  parentName: { type: DataTypes.STRING, field: 'parent_name' },
  parentPhone: { type: DataTypes.STRING, field: 'parent_phone' },
  parentEmail: { type: DataTypes.STRING, field: 'parent_email' },
});

module.exports = Member;
