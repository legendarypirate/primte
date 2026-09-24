const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Competitor = sequelize.define(
  'Competitor',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    matchId: { type: DataTypes.UUID, allowNull: false, field: 'match_id' },
    registrationId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'registration_id' },
    memberId: { type: DataTypes.UUID, allowNull: false, field: 'member_id' },
    bibNumber: { type: DataTypes.STRING, field: 'bib_number' },
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    divisionId: { type: DataTypes.UUID, field: 'division_id' },
    matchDivisionId: { type: DataTypes.UUID, field: 'match_division_id' },
    categoryId: { type: DataTypes.UUID, field: 'category_id' },
    powerFactor: {
      type: DataTypes.ENUM('MAJOR', 'MINOR', 'NONE'),
      defaultValue: 'MINOR',
      field: 'power_factor',
    },
    squadId: { type: DataTypes.UUID, field: 'squad_id' },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'WITHDRAWN', 'DQ'),
      defaultValue: 'ACTIVE',
    },
  },
  {
    tableName: 'competitors',
    underscored: true,
    indexes: [
      { fields: ['match_id'] },
      { fields: ['registration_id'], unique: true },
      { fields: ['division_id'] },
      { fields: ['squad_id'] },
      { fields: ['member_id'] },
    ],
  }
);

module.exports = Competitor;
