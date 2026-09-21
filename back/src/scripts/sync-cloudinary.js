require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { Op } = require('sequelize');
const { sequelize, Product, Competition, Training, Member } = require('../models');
const { uploadLocal } = require('../utils/media');

const files = [
  'avatar.png',
  'bb_pellets.png',
  'green_gas.png',
  'tactical_gloves.png',
  'prime_jersey.png',
  'prime_cup.png',
  'winter_challenge.png',
  'tactical_training.png',
];

async function run() {
  const urls = {};
  for (const file of files) {
    urls[`/uploads/${file}`] = await uploadLocal(file);
    console.log(file, '->', urls[`/uploads/${file}`]);
  }

  const replace = async (Model, field) => {
    const rows = await Model.findAll({ where: { [field]: { [Op.like]: '/uploads/%' } } });
    for (const row of rows) {
      const next = urls[row[field]];
      if (next) await row.update({ [field]: next });
    }
    return rows.length;
  };

  console.log('products', await replace(Product, 'imageUrl'));
  console.log('competitions', await replace(Competition, 'imageUrl'));
  console.log('trainings', await replace(Training, 'imageUrl'));
  console.log('members', await replace(Member, 'avatarUrl'));
  await sequelize.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
