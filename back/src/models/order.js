const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  total: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('paid', 'fulfilled', 'cancelled'), defaultValue: 'paid' },
});

module.exports = Order;
