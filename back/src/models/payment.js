const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  parentId: { type: DataTypes.UUID, allowNull: false, field: 'parent_id' },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  method: { type: DataTypes.ENUM('qpay', 'khan', 'golomt', 'other'), defaultValue: 'qpay' },
  status: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
  referenceId: { type: DataTypes.STRING, field: 'reference_id' },
  description: { type: DataTypes.STRING },
});

module.exports = Payment;
