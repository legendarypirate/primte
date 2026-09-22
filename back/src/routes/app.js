const express = require('express');
const { Op } = require('sequelize');
const {
  sequelize,
  Product,
  Competition,
  Training,
  Notice,
  Transaction,
  Order,
  OrderItem,
  Registration,
  Setting,
  Division,
  MatchType,
} = require('../models');
const { requireMember } = require('../middleware/auth');
const {
  serializeMember,
  serializeProduct,
  serializeCompetition,
  serializeRegistration,
  serializeTraining,
  formatDate,
  formatTime,
} = require('../utils/helpers');

async function loadCompetitionDivisions(competition) {
  const ids = competition.divisionIds || [];
  if (!ids.length) return [];
  return Division.findAll({ where: { id: ids } });
}

async function serializeCompetitionForMember(competition, req, memberId, extra = {}) {
  const [divisions, joined, registration] = await Promise.all([
    loadCompetitionDivisions(competition),
    extra.joined ?? Registration.count({
      where: { competitionId: competition.id, status: { [Op.ne]: 'cancelled' } },
    }),
    memberId
      ? Registration.findOne({
          where: { memberId, competitionId: competition.id, status: { [Op.ne]: 'cancelled' } },
          include: [Division],
        })
      : null,
  ]);
  return serializeCompetition(competition, req, {
    ...extra,
    joined,
    registered: Boolean(registration),
    registration,
    divisions: divisions.map((d) => ({
      id: d.id,
      abbreviation: d.abbreviation,
      name: d.name,
      description: d.description,
    })),
  });
}

function buildPaymentReference(competition, division, squadLabel, seq) {
  const year = competition.eventDate
    ? new Date(competition.eventDate).getFullYear()
    : new Date().getFullYear();
  const abbr = division?.abbreviation || 'GEN';
  const sq = (squadLabel || 'NA').replace(/\s+/g, '');
  return `${year}-${abbr}-${sq}-${String(seq).padStart(3, '0')}`;
}

const router = express.Router();
router.use(requireMember);

router.get('/home', async (req, res) => {
  const clubRow = await Setting.findByPk('club');
  const club = clubRow?.value || { open: true, todayCount: 0, capacity: 40 };
  const competitions = await Competition.findAll({
    where: { status: ['upcoming', 'open'] },
    order: [['eventDate', 'ASC']],
    limit: 3,
  });
  const trainings = await Training.findAll({ order: [['eventDate', 'ASC']], limit: 3 });
  const notices = await Notice.findAll({
    where: { published: true },
    order: [['createdAt', 'DESC']],
    limit: 10,
  });
  const counts = await Registration.findAll({
    attributes: ['competitionId', [sequelize.fn('COUNT', sequelize.col('id')), 'joined']],
    where: { status: { [Op.ne]: 'cancelled' } },
    group: ['competitionId'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.competitionId, Number(c.joined)]));

  res.json({
    member: serializeMember(req.member, req),
    club,
    competitions: await Promise.all(
      competitions.map((c) =>
        serializeCompetitionForMember(c, req, req.member.id, { joined: map[c.id] || 0 })
      )
    ),
    trainings: trainings.map((t) => serializeTraining(t, req)),
    notices,
    unreadNotices: notices.length,
  });
});

router.get('/products', async (req, res) => {
  const products = await Product.findAll({ order: [['sortOrder', 'ASC']] });
  res.json({ products: products.map((p) => serializeProduct(p, req)) });
});

router.get('/competitions', async (req, res) => {
  const competitions = await Competition.findAll({
    include: [{ model: MatchType, required: false }],
    order: [['eventDate', 'ASC']],
  });
  const counts = await Registration.findAll({
    attributes: ['competitionId', [sequelize.fn('COUNT', sequelize.col('id')), 'joined']],
    where: { status: { [Op.ne]: 'cancelled' } },
    group: ['competitionId'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.competitionId, Number(c.joined)]));
  res.json({
    competitions: await Promise.all(
      competitions.map((c) =>
        serializeCompetitionForMember(c, req, req.member.id, { joined: map[c.id] || 0 })
      )
    ),
  });
});

router.get('/competitions/:id', async (req, res) => {
  const competition = await Competition.findByPk(req.params.id, {
    include: [{ model: MatchType, required: false }],
  });
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  res.json({
    competition: await serializeCompetitionForMember(competition, req, req.member.id),
  });
});

router.post('/competitions/:id/register', async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (competition.status === 'upcoming') {
    return res.status(400).json({ message: 'Бүртгэл хараахан нээгдээгүй.' });
  }
  if (competition.status === 'past') {
    return res.status(400).json({ message: 'Бүртгэл хаагдсан.' });
  }
  const existing = await Registration.findOne({
    where: {
      memberId: req.member.id,
      competitionId: competition.id,
      status: { [Op.ne]: 'cancelled' },
    },
    include: [Division],
  });
  if (existing) {
    return res.json({ ok: true, already: true, registration: serializeRegistration(existing) });
  }

  const { divisionId, divisionAbbreviation, category, squadLabel, payNow = true } = req.body || {};
  const joined = await Registration.count({
    where: { competitionId: competition.id, status: { [Op.ne]: 'cancelled' } },
  });
  if (joined >= competition.capacity) {
    return res.status(400).json({ message: 'Хүчин чадал дүүрсэн.' });
  }

  let division = null;
  if (divisionId) {
    division = await Division.findByPk(divisionId);
  }
  if (!division && divisionAbbreviation) {
    division = await Division.findOne({ where: { abbreviation: divisionAbbreviation } });
  }
  if (!division && divisionId && !/^[0-9a-f-]{36}$/i.test(String(divisionId))) {
    division = await Division.findOne({ where: { abbreviation: divisionId } });
  }

  const shouldPayNow = payNow !== false;
  if (shouldPayNow && req.member.walletBalance < competition.fee) {
    return res.status(400).json({ message: 'Wallet үлдэгдэл хүрэлцэхгүй байна.' });
  }

  const seq = joined + 1;
  const paymentReference = buildPaymentReference(competition, division, squadLabel, seq);
  const status = shouldPayNow ? 'confirmed' : 'waitlist';

  let registration;
  await sequelize.transaction(async (t) => {
    if (shouldPayNow && competition.fee > 0) {
      await req.member.decrement('walletBalance', { by: competition.fee, transaction: t });
      await Transaction.create(
        {
          memberId: req.member.id,
          title: competition.title,
          amount: -competition.fee,
          kind: 'fee',
        },
        { transaction: t }
      );
    }
    if (shouldPayNow) {
      await req.member.increment('competitionCount', { by: 1, transaction: t });
    }
    registration = await Registration.create(
      {
        memberId: req.member.id,
        competitionId: competition.id,
        divisionId: division?.id || null,
        category: category || null,
        squadLabel: squadLabel || null,
        status,
        paymentReference,
        feePaid: shouldPayNow ? competition.fee : 0,
      },
      { transaction: t }
    );
  });

  await req.member.reload();
  const withIncludes = await Registration.findByPk(registration.id, { include: [Division] });
  res.json({
    ok: true,
    member: serializeMember(req.member, req),
    registration: serializeRegistration(withIncludes),
  });
});

router.post('/competitions/:id/register/qpay/confirm', async (req, res) => {
  const registration = await Registration.findOne({
    where: {
      memberId: req.member.id,
      competitionId: req.params.id,
      status: { [Op.in]: ['waitlist', 'pending'] },
    },
    include: [Division],
  });
  if (!registration) return res.status(404).json({ message: 'Хүлээлгийн бүртгэл олдсонгүй.' });

  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });

  await sequelize.transaction(async (t) => {
    await req.member.increment('competitionCount', { by: 1, transaction: t });
    await registration.update(
      { status: 'confirmed', feePaid: competition.fee },
      { transaction: t }
    );
    await Transaction.create(
      {
        memberId: req.member.id,
        title: `${competition.title} (QPay)`,
        amount: -competition.fee,
        kind: 'fee',
      },
      { transaction: t }
    );
  });

  await req.member.reload();
  await registration.reload({ include: [Division] });
  res.json({
    ok: true,
    member: serializeMember(req.member, req),
    registration: serializeRegistration(registration),
  });
});

router.post('/competitions/:id/register/pay', async (req, res) => {
  const registration = await Registration.findOne({
    where: {
      memberId: req.member.id,
      competitionId: req.params.id,
      status: { [Op.in]: ['waitlist', 'pending'] },
    },
    include: [Division],
  });
  if (!registration) return res.status(404).json({ message: 'Хүлээлгийн бүртгэл олдсонгүй.' });

  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (req.member.walletBalance < competition.fee) {
    return res.status(400).json({ message: 'Wallet үлдэгдэл хүрэлцэхгүй байна.' });
  }

  await sequelize.transaction(async (t) => {
    await req.member.decrement('walletBalance', { by: competition.fee, transaction: t });
    await req.member.increment('competitionCount', { by: 1, transaction: t });
    await registration.update(
      { status: 'confirmed', feePaid: competition.fee },
      { transaction: t }
    );
    await Transaction.create(
      {
        memberId: req.member.id,
        title: competition.title,
        amount: -competition.fee,
        kind: 'fee',
      },
      { transaction: t }
    );
  });

  await req.member.reload();
  await registration.reload({ include: [Division] });
  res.json({
    ok: true,
    member: serializeMember(req.member, req),
    registration: serializeRegistration(registration),
  });
});

router.get('/wallet', async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { memberId: req.member.id },
    order: [['createdAt', 'DESC']],
  });
  res.json({
    balance: req.member.walletBalance,
    transactions: transactions.map((tx) => ({
      id: tx.id,
      title: tx.title,
      amount: tx.amount,
      kind: tx.kind,
      dateLabel: formatDate(tx.createdAt),
      timeLabel: formatTime(tx.createdAt),
    })),
  });
});

router.post('/wallet/topup', async (req, res) => {
  const amount = Number(req.body?.amount || 0);
  if (amount <= 0) return res.status(400).json({ message: 'Дүн буруу.' });
  await sequelize.transaction(async (t) => {
    await req.member.increment('walletBalance', { by: amount, transaction: t });
    await Transaction.create(
      { memberId: req.member.id, title: 'Wallet цэнэглэл', amount, kind: 'topup' },
      { transaction: t }
    );
  });
  await req.member.reload();
  res.json({ balance: req.member.walletBalance, member: serializeMember(req.member, req) });
});

router.post('/orders', async (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ message: 'Сагс хоосон.' });
  const products = await Product.findAll({
    where: { id: items.map((i) => i.productId) },
  });
  const map = Object.fromEntries(products.map((p) => [p.id, p]));
  let total = 0;
  const prepared = [];
  for (const item of items) {
    const product = map[item.productId];
    if (!product || !product.inStock) {
      return res.status(400).json({ message: 'Бүтээгдэхүүн боломжгүй.' });
    }
    const qty = Number(item.quantity || 1);
    total += product.price * qty;
    prepared.push({ product, qty });
  }
  if (req.member.walletBalance < total) {
    return res.status(400).json({ message: 'Үлдэгдэл хүрэлцэхгүй.' });
  }
  let order;
  await sequelize.transaction(async (t) => {
    order = await Order.create({ memberId: req.member.id, total, status: 'paid' }, { transaction: t });
    for (const row of prepared) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: row.product.id,
          name: row.product.name,
          price: row.product.price,
          quantity: row.qty,
        },
        { transaction: t }
      );
      await Transaction.create(
        {
          memberId: req.member.id,
          title: row.product.name,
          amount: -(row.product.price * row.qty),
          kind: 'purchase',
        },
        { transaction: t }
      );
    }
    await req.member.decrement('walletBalance', { by: total, transaction: t });
  });
  await req.member.reload();
  res.json({ ok: true, order, member: serializeMember(req.member, req) });
});

router.get('/notices', async (_req, res) => {
  const notices = await Notice.findAll({
    where: { published: true },
    order: [['createdAt', 'DESC']],
  });
  res.json({ notices });
});

router.get('/profile', async (req, res) => {
  res.json({ member: serializeMember(req.member, req) });
});

router.get('/qr', async (req, res) => {
  res.json({
    payload: `PRIME|${req.member.memberCode}|${Date.now()}`,
    member: serializeMember(req.member, req),
    ttl: 30,
  });
});

module.exports = router;
