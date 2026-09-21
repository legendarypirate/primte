const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const {
  sequelize,
  Role,
  Member,
  MemberType,
  DevelopmentActivity,
  Product,
  Competition,
  Training,
  Notice,
  Transaction,
  Order,
  OrderItem,
  Registration,
  Attendance,
  Setting,
} = require('../models');
const { requireAdmin, requirePermission } = require('../middleware/auth');
const { serializeMember, serializeProduct, serializeCompetition, serializeTraining } = require('../utils/helpers');

const router = express.Router();
router.use(requireAdmin);

router.get('/lookups', async (_req, res) => {
  const [roles, memberTypes, activities] = await Promise.all([
    Role.findAll({ order: [['sortOrder', 'ASC']] }),
    MemberType.findAll({ order: [['sortOrder', 'ASC']] }),
    DevelopmentActivity.findAll({ order: [['sortOrder', 'ASC']] }),
  ]);
  res.json({ roles, memberTypes, activities });
});

function pick(body, keys) {
  const out = {};
  for (const key of keys) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

router.get('/dashboard', requirePermission('dashboard.view'), async (_req, res) => {
  const [members, products, competitions, orders, attendanceToday, walletSum] = await Promise.all([
    Member.count(),
    Product.count(),
    Competition.count(),
    Order.count(),
    Attendance.count({
      where: { createdAt: { [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    Member.sum('walletBalance'),
  ]);
  const recentMembers = await Member.findAll({ order: [['createdAt', 'DESC']], limit: 5 });
  const recentOrders = await Order.findAll({
    include: [{ model: Member }, { model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });
  res.json({
    stats: {
      members,
      products,
      competitions,
      orders,
      attendanceToday,
      walletSum: walletSum || 0,
    },
    recentMembers,
    recentOrders,
  });
});

router.get('/settings', requirePermission('settings.manage'), async (_req, res) => {
  const rows = await Setting.findAll();
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  res.json({ settings });
});

router.put('/settings', requirePermission('settings.manage'), async (req, res) => {
  const entries = Object.entries(req.body || {});
  for (const [key, value] of entries) {
    await Setting.upsert({ key, value });
  }
  const rows = await Setting.findAll();
  res.json({ settings: Object.fromEntries(rows.map((row) => [row.key, row.value])) });
});

router.get('/members', requirePermission('members.view'), async (req, res) => {
  const q = req.query.q;
  const where = q
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { memberCode: { [Op.iLike]: `%${q}%` } },
          { phone: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : undefined;
  const members = await Member.findAll({
    where,
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ members: members.map((m) => serializeMember(m, req)) });
});

router.post('/members', requirePermission('members.create'), async (req, res) => {
  const {
    name,
    memberCode,
    phone,
    motto,
    level,
    rank,
    competitionCount,
    validFrom,
    validTo,
    status,
    walletBalance,
    memberTypeId,
    developmentActivityId,
    parentId,
    parentName,
    parentPhone,
    parentEmail,
    avatarUrl,
  } = req.body || {};
  if (!name || !memberCode) return res.status(400).json({ message: 'Нэр болон код шаардлагатай.' });
  const exists = await Member.findOne({ where: { memberCode } });
  if (exists) return res.status(400).json({ message: 'Энэ гишүүний код бүртгэлтэй.' });
  const type = memberTypeId ? await MemberType.findByPk(memberTypeId) : null;
  if (type?.requiresParent && !parentId && !parentName) {
    return res.status(400).json({ message: 'Junior гишүүнд эцэг/эх мэдээлэл шаардлагатай.' });
  }
  const member = await Member.create({
    name,
    memberCode,
    pinHash: await bcrypt.hash(memberCode, 10),
    phone,
    motto,
    level: level ?? 1,
    rank: rank ?? 0,
    competitionCount: competitionCount ?? 0,
    validFrom,
    validTo,
    status: type?.isInactive ? 'inactive' : status || 'active',
    walletBalance: walletBalance ?? 0,
    memberTypeId,
    developmentActivityId,
    parentId: parentId || null,
    parentName,
    parentPhone,
    parentEmail,
    avatarUrl,
  });
  const created = await Member.findByPk(member.id, {
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }],
  });
  res.status(201).json({ member: serializeMember(created, req) });
});

router.get('/members/:id', requirePermission('members.view'), async (req, res) => {
  const member = await Member.findByPk(req.params.id, {
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }],
  });
  if (!member) return res.status(404).json({ message: 'Гишүүн олдсонгүй.' });
  const [transactions, orders, registrations, attendance] = await Promise.all([
    Transaction.findAll({ where: { memberId: member.id }, order: [['createdAt', 'DESC']] }),
    Order.findAll({ where: { memberId: member.id }, include: [{ model: OrderItem, as: 'items' }] }),
    Registration.findAll({ where: { memberId: member.id }, include: [Competition] }),
    Attendance.findAll({ where: { memberId: member.id }, order: [['createdAt', 'DESC']], limit: 20 }),
  ]);
  res.json({ member: serializeMember(member, req), transactions, orders, registrations, attendance });
});

router.put('/members/:id', requirePermission('members.update'), async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.status(404).json({ message: 'Гишүүн олдсонгүй.' });
  const data = pick(req.body, [
    'name',
    'memberCode',
    'phone',
    'motto',
    'level',
    'rank',
    'competitionCount',
    'validFrom',
    'validTo',
    'status',
    'walletBalance',
    'avatarUrl',
    'memberTypeId',
    'developmentActivityId',
    'parentId',
    'parentName',
    'parentPhone',
    'parentEmail',
  ]);
  if (data.memberTypeId) {
    const type = await MemberType.findByPk(data.memberTypeId);
    if (type?.isInactive) data.status = 'inactive';
    if (type?.requiresParent && !data.parentId && !data.parentName && !member.parentName) {
      return res.status(400).json({ message: 'Junior гишүүнд эцэг/эх мэдээлэл шаардлагатай.' });
    }
  }
  if (data.memberCode && data.memberCode !== member.memberCode) {
    member.pinHash = await bcrypt.hash(data.memberCode, 10);
  }
  await member.update(data);
  const updated = await Member.findByPk(member.id, {
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }],
  });
  res.json({ member: serializeMember(updated, req) });
});

router.delete('/members/:id', requirePermission('members.delete'), async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.status(404).json({ message: 'Гишүүн олдсонгүй.' });
  await member.destroy();
  res.json({ ok: true });
});

router.post('/members/:id/topup', requirePermission('members.topup'), async (req, res) => {
  const amount = Number(req.body?.amount || 0);
  if (amount <= 0) return res.status(400).json({ message: 'Дүн буруу.' });
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.status(404).json({ message: 'Гишүүн олдсонгүй.' });
  await sequelize.transaction(async (t) => {
    await member.increment('walletBalance', { by: amount, transaction: t });
    await Transaction.create(
      { memberId: member.id, title: 'Wallet цэнэглэл', amount, kind: 'topup' },
      { transaction: t }
    );
  });
  await member.reload();
  res.json({ member: serializeMember(member, req) });
});

router.get('/products', requirePermission('products.view'), async (req, res) => {
  const products = await Product.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
  res.json({ products: products.map((p) => serializeProduct(p, req)) });
});

router.post('/products', requirePermission('products.manage'), async (req, res) => {
  const product = await Product.create(req.body || {});
  res.status(201).json({ product: serializeProduct(product, req) });
});

router.put('/products/:id', requirePermission('products.manage'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Бүтээгдэхүүн олдсонгүй.' });
  await product.update(req.body || {});
  res.json({ product: serializeProduct(product, req) });
});

router.delete('/products/:id', requirePermission('products.manage'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Бүтээгдэхүүн олдсонгүй.' });
  await product.destroy();
  res.json({ ok: true });
});

router.get('/competitions', requirePermission('competitions.view'), async (req, res) => {
  const competitions = await Competition.findAll({ order: [['eventDate', 'ASC']] });
  const counts = await Registration.findAll({
    attributes: ['competitionId', [sequelize.fn('COUNT', sequelize.col('id')), 'joined']],
    group: ['competitionId'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.competitionId, Number(c.joined)]));
  res.json({
    competitions: competitions.map((c) => serializeCompetition(c, req, { joined: map[c.id] || 0 })),
  });
});

router.post('/competitions', requirePermission('competitions.manage'), async (req, res) => {
  const competition = await Competition.create(req.body || {});
  res.status(201).json({ competition: serializeCompetition(competition, req, { joined: 0 }) });
});

router.put('/competitions/:id', requirePermission('competitions.manage'), async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  await competition.update(req.body || {});
  res.json({ competition: serializeCompetition(competition, req) });
});

router.delete('/competitions/:id', requirePermission('competitions.manage'), async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  await competition.destroy();
  res.json({ ok: true });
});

router.get('/competitions/:id/registrations', requirePermission('competitions.view'), async (req, res) => {
  const rows = await Registration.findAll({
    where: { competitionId: req.params.id },
    include: [Member],
    order: [['createdAt', 'DESC']],
  });
  res.json({ registrations: rows });
});

router.get('/trainings', requirePermission('trainings.view'), async (req, res) => {
  const trainings = await Training.findAll({ order: [['eventDate', 'ASC']] });
  res.json({ trainings: trainings.map((t) => serializeTraining(t, req)) });
});

router.post('/trainings', requirePermission('trainings.manage'), async (req, res) => {
  const training = await Training.create(req.body || {});
  res.status(201).json({ training });
});

router.put('/trainings/:id', requirePermission('trainings.manage'), async (req, res) => {
  const training = await Training.findByPk(req.params.id);
  if (!training) return res.status(404).json({ message: 'Сургалт олдсонгүй.' });
  await training.update(req.body || {});
  res.json({ training });
});

router.delete('/trainings/:id', requirePermission('trainings.manage'), async (req, res) => {
  const training = await Training.findByPk(req.params.id);
  if (!training) return res.status(404).json({ message: 'Сургалт олдсонгүй.' });
  await training.destroy();
  res.json({ ok: true });
});

router.get('/notices', requirePermission('notices.view'), async (_req, res) => {
  const notices = await Notice.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ notices });
});

router.post('/notices', requirePermission('notices.manage'), async (req, res) => {
  const notice = await Notice.create(req.body || {});
  res.status(201).json({ notice });
});

router.put('/notices/:id', requirePermission('notices.manage'), async (req, res) => {
  const notice = await Notice.findByPk(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Мэдэгдэл олдсонгүй.' });
  await notice.update(req.body || {});
  res.json({ notice });
});

router.delete('/notices/:id', requirePermission('notices.manage'), async (req, res) => {
  const notice = await Notice.findByPk(req.params.id);
  if (!notice) return res.status(404).json({ message: 'Мэдэгдэл олдсонгүй.' });
  await notice.destroy();
  res.json({ ok: true });
});

router.get('/orders', requirePermission('orders.view'), async (_req, res) => {
  const orders = await Order.findAll({
    include: [{ model: Member }, { model: OrderItem, as: 'items' }],
    order: [['createdAt', 'DESC']],
  });
  res.json({ orders });
});

router.put('/orders/:id', requirePermission('orders.manage'), async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Захиалга олдсонгүй.' });
  await order.update({ status: req.body.status });
  res.json({ order });
});

router.get('/transactions', requirePermission('transactions.view'), async (req, res) => {
  const transactions = await Transaction.findAll({
    include: [Member],
    order: [['createdAt', 'DESC']],
    limit: Number(req.query.limit || 100),
  });
  res.json({ transactions });
});

router.get('/attendance', requirePermission('attendance.view'), async (_req, res) => {
  const attendance = await Attendance.findAll({
    include: [Member],
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  res.json({ attendance });
});

router.post('/attendance/scan', requirePermission('attendance.scan'), async (req, res) => {
  const payload = String(req.body?.payload || '');
  const parts = payload.split('|');
  const code = parts[1];
  if (!code) return res.status(400).json({ message: 'QR буруу.' });
  const member = await Member.findOne({ where: { memberCode: code } });
  if (!member) return res.status(404).json({ message: 'Гишүүн олдсонгүй.' });
  const row = await Attendance.create({ memberId: member.id, note: 'QR scan' });
  const setting = await Setting.findByPk('club');
  if (setting?.value) {
    const next = { ...setting.value, todayCount: Number(setting.value.todayCount || 0) + 1 };
    await setting.update({ value: next });
  }
  res.json({ attendance: row, member: serializeMember(member, req) });
});

module.exports = router;
