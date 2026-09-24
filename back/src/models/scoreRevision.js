const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScoreRevision = sequelize.define(
  'ScoreRevision',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    scoreId: { type: DataTypes.UUID, allowNull: false, field: 'score_id' },
    revisionNumber: { type: DataTypes.INTEGER, allowNull: false, field: 'revision_number' },
    oldData: { type: DataTypes.JSONB, allowNull: false, field: 'old_data' },
    newData: { type: DataTypes.JSONB, allowNull: false, field: 'new_data' },
    changedBy: { type: DataTypes.UUID, field: 'changed_by' },
    reason: { type: DataTypes.TEXT },
  },
  { tableName: 'score_revisions', underscored: true, indexes: [{ fields: ['score_id'] }] }
);

module.exports = ScoreRevision;
