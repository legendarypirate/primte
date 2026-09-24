require('dotenv').config();
const bcrypt = require('bcryptjs');
const {
  sequelize,
  ScoringProfile,
  Competition,
  Match,
  Stage,
  Squad,
  MatchDivision,
  MatchCategory,
  Division,
  Member,
  Registration,
  Competitor,
} = require('./models');
const { IPSC_HANDGUN, IPSC_ACTION_AIR } = require('./domain/scoring/scoring-profile');
const { ensureCompetitorFromRegistration } = require('./services/competitorService');

async function seedDemo() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  for (const profile of [IPSC_HANDGUN, IPSC_ACTION_AIR]) {
    await ScoringProfile.upsert(profile);
  }

  let competition = await Competition.findOne({ order: [['createdAt', 'ASC']] });
  if (!competition) {
    competition = await Competition.create({
      title: 'PRIME CUP 2026',
      subtitle: 'Scoring demo',
      eventDate: '2026-10-12',
      location: 'Ulaanbaatar',
      capacity: 50,
      fee: 50000,
      stageCount: 6,
      status: 'open',
    });
  }

  let match = await Match.findOne({ where: { competitionId: competition.id } });
  if (!match) {
    match = await Match.create({
      competitionId: competition.id,
      name: competition.title,
      discipline: 'IPSC Action Air',
      scoringProfileId: 'IPSC_ACTION_AIR',
      status: 'ACTIVE',
      startDate: competition.eventDate,
      location: competition.location,
    });

    for (let i = 1; i <= (competition.stageCount || 6); i++) {
      await Stage.create({
        matchId: match.id,
        number: i,
        name: `Stage ${i}`,
        courseType: 'SHORT',
        maximumPoints: 100,
        status: i === 1 ? 'ACTIVE' : 'WAITING',
      });
    }
  }

  const divisions = await Division.findAll({ limit: 4 });
  if (!divisions.length) {
    await Division.bulkCreate([
      { abbreviation: 'OP', name: 'Open', description: 'Open division' },
      { abbreviation: 'PROD', name: 'Production', description: 'Production division' },
      { abbreviation: 'ST', name: 'Standard', description: 'Standard division' },
    ]);
  }
  const divs = divisions.length ? divisions : await Division.findAll();

  for (const d of divs) {
    await MatchDivision.findOrCreate({
      where: { matchId: match.id, code: d.abbreviation },
      defaults: {
        matchId: match.id,
        divisionId: d.id,
        name: d.name,
        code: d.abbreviation,
        enabled: true,
      },
    });
  }

  await MatchCategory.findOrCreate({
    where: { matchId: match.id, code: 'Overall' },
    defaults: { matchId: match.id, name: 'Overall', code: 'Overall', enabled: true },
  });

  const squad = await Squad.findOrCreate({
    where: { matchId: match.id, name: 'Squad 1' },
    defaults: { matchId: match.id, name: 'Squad 1', capacity: 20, status: 'ACTIVE' },
  }).then(([s]) => s);

  const member = await Member.findOne({ where: { memberCode: 'PRIME-000125' } });
  if (member) {
    let registration = await Registration.findOne({
      where: { memberId: member.id, competitionId: competition.id },
    });
    if (!registration) {
      registration = await Registration.create({
        memberId: member.id,
        competitionId: competition.id,
        divisionId: divs[0]?.id,
        category: 'Overall',
        squadLabel: 'Squad 1',
        status: 'confirmed',
        paymentReference: '2026-OP-SQ1-001',
        feePaid: competition.fee,
      });
    } else if (registration.status !== 'confirmed') {
      await registration.update({ status: 'confirmed', squadLabel: 'Squad 1' });
    }
    await ensureCompetitorFromRegistration(registration.id);
  }

  console.log('Scoring demo seeded.');
  console.log(`Match: ${match.name} (${match.id})`);
  console.log('Admin login: admin@prime.mn / PrimeAdmin0328');
  console.log('Score app: flutter run --dart-define=API_BASE=http://localhost:3151');
  await sequelize.close();
}

seedDemo().catch((err) => {
  console.error(err);
  process.exit(1);
});
