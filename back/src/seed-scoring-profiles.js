require('dotenv').config();
const { sequelize, ScoringProfile } = require('./models');
const { IPSC_HANDGUN, IPSC_ACTION_AIR } = require('./domain/scoring/scoring-profile');

async function seedProfiles() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  for (const profile of [IPSC_HANDGUN, IPSC_ACTION_AIR]) {
    await ScoringProfile.upsert(profile);
  }
  console.log('Scoring profiles seeded.');
  process.exit(0);
}

seedProfiles().catch((err) => {
  console.error(err);
  process.exit(1);
});
