const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Match = sequelize.define(
  'Match',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    competitionId: { type: DataTypes.UUID, field: 'competition_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    discipline: { type: DataTypes.STRING },
    scoringProfileId: { type: DataTypes.STRING, allowNull: false, field: 'scoring_profile_id' },
    status: {
      type: DataTypes.ENUM('DRAFT', 'REGISTRATION', 'ACTIVE', 'SCORING_COMPLETE', 'PROVISIONAL', 'FINAL'),
      defaultValue: 'DRAFT',
    },
    startDate: { type: DataTypes.DATE, field: 'start_date' },
    endDate: { type: DataTypes.DATE, field: 'end_date' },
    location: { type: DataTypes.STRING },
  },
  { tableName: 'matches', underscored: true }
);

module.exports = Match;
