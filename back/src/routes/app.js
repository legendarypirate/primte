const express = require('express');
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
} = require('../models');
const { requireMember } = require('../middleware/auth');
const {
  serializeMember,
  serializeProduct,
  serializeCompetition,
  serializeTraining,
  formatDate,
  formatTime,
} = require('../utils/helpers');

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
  const registered = await Registration.findAll({ where: { memberId: req.member.id } });
  const registeredIds = new Set(registered.map((r) => r.competitionId));
  const counts = await Registration.findAll({
    attributes: ['competitionId', [sequelize.fn('COUNT', sequelize.col('id')), 'joined']],
    group: ['competitionId'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.competitionId, Number(c.joined)]));

  res.json({
    member: serializeMember(req.member, req),
    club,
    competitions: competitions.map((c) =>
      serializeCompetition(c, req, { joined: map[c.id] || 0, registered: registeredIds.has(c.id) })
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
  const competitions = await Competition.findAll({ order: [['eventDate', 'ASC']] });
  const registered = await Registration.findAll({ where: { memberId: req.member.id } });
  const registeredIds = new Set(registered.map((r) => r.competitionId));
  const counts = await Registration.findAll({
    attributes: ['competitionId', [sequelize.fn('COUNT', sequelize.col('id')), 'joined']],
    group: ['competitionId'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.competitionId, Number(c.joined)]));
  res.json({
    competitions: competitions.map((c) =>
      serializeCompetition(c, req, { joined: map[c.id] || 0, registered: registeredIds.has(c.id) })
    ),
  });
});

router.post('/competitions/:id/register', async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  if (competition.status === 'upcoming') {
    return res.status(400).json({ message: 'Бүртгэл хараахан нээгдээгүй.' });
  }
  const existing = await Registration.findOne({
    where: { memberId: req.member.id, competitionId: competition.id },
  });
  if (existing) return res.json({ ok: true, already: true });
  const joined = await Registration.count({ where: { competitionId: competition.id } });
  if (joined >= competition.capacity) {
    return res.status(400).json({ message: 'Хүчин чадал дүүрсэн.' });
  }
  if (req.member.walletBalance < competition.fee) {
    return res.status(400).json({ message: 'Wallet үлдэгдэл хүрэлцэхгүй байна.' });
  }
  await sequelize.transaction(async (t) => {
    await req.member.decrement('walletBalance', { by: competition.fee, transaction: t });
    await req.member.increment('competitionCount', { by: 1, transaction: t });
    await Registration.create(
      { memberId: req.member.id, competitionId: competition.id },
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
  res.json({ ok: true, member: serializeMember(req.member, req) });
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
