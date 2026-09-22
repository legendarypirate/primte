const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
  competitionId: { type: DataTypes.UUID, allowNull: false, field: 'competition_id' },
  divisionId: { type: DataTypes.UUID, field: 'division_id' },
  category: { type: DataTypes.STRING },
  squadLabel: { type: DataTypes.STRING, field: 'squad_label' },
  status: {
    type: DataTypes.ENUM('pending', 'waitlist', 'paid', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed',
  },
  paymentReference: { type: DataTypes.STRING, field: 'payment_reference' },
  feePaid: { type: DataTypes.INTEGER, defaultValue: 0, field: 'fee_paid' },
});

module.exports = Registration;
