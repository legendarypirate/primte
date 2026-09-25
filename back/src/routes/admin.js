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
  ProductCategory,
  Competition,
  Training,
  Notice,
  Transaction,
  Order,
  OrderItem,
  Registration,
  Attendance,
  Setting,
  Division,
  MatchType,
} = require('../models');
const { requireAdmin, requirePermission } = require('../middleware/auth');
const {
  serializeMember,
  serializeProduct,
  serializeProductCategory,
  serializeCompetition,
  serializeRegistration,
  serializeTraining,
} = require('../utils/helpers');
const { uniqueSlug } = require('../services/productCategoryService');

const COMPETITION_FIELDS = [
  'title', 'subtitle', 'eventDate', 'eventEndDate', 'registrationOpenAt', 'registrationCloseAt',
  'location', 'organizer', 'imageUrl', 'capacity', 'fee', 'level', 'stageCount', 'minShots',
  'matchTypeId', 'divisionIds', 'categories', 'squads', 'schedule', 'about', 'prizes', 'rules',
  'requirements', 'refundPolicy', 'extraInfo', 'mdName', 'mdPhone', 'mdEmail', 'squadCapacity',
  'squadsPerShift', 'lateRegistrationNote', 'facts', 'tags', 'status',
];

async function loadCompetitionDivisions(competition) {
  const ids = competition.divisionIds || [];
  if (!ids.length) return [];
  return Division.findAll({ where: { id: ids } });
}

async function serializeCompetitionAdmin(competition, req, extra = {}) {
  const [divisions, joined] = await Promise.all([
    loadCompetitionDivisions(competition),
    extra.joined ?? Registration.count({ where: { competitionId: competition.id, status: { [Op.ne]: 'cancelled' } } }),
  ]);
  return serializeCompetition(competition, req, {
    ...extra,
    joined,
    divisions: divisions.map((d) => ({
      id: d.id,
      abbreviation: d.abbreviation,
      name: d.name,
      description: d.description,
    })),
  });
}

const router = express.Router();
router.use(requireAdmin);

router.get('/lookups', async (_req, res) => {
  const [roles, memberTypes, activities, divisions, matchTypes] = await Promise.all([
    Role.findAll({ order: [['sortOrder', 'ASC']] }),
    MemberType.findAll({ order: [['sortOrder', 'ASC']] }),
    DevelopmentActivity.findAll({ order: [['sortOrder', 'ASC']] }),
    Division.findAll({ order: [['abbreviation', 'ASC']] }),
    MatchType.findAll({ order: [['name', 'ASC']] }),
  ]);
  res.json({ roles, memberTypes, activities, divisions, matchTypes });
});

function pick(body, keys) {
  const out = {};
  for (const key of keys) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

const COMPETITION_DATE_FIELDS = ['eventDate', 'eventEndDate', 'registrationOpenAt', 'registrationCloseAt'];

function sanitizeCompetitionInput(body) {
  const out = pick(body || {}, COMPETITION_FIELDS);
  for (const key of COMPETITION_DATE_FIELDS) {
    if (!(key in out)) continue;
    const value = out[key];
    if (value === '' || value === null || value === 'Invalid date') {
      out[key] = null;
      continue;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) out[key] = null;
  }
  if (out.matchTypeId === '') out.matchTypeId = null;
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
    parentAccountId,
    parentName,
    parentPhone,
    parentEmail,
    avatarUrl,
  } = req.body || {};
  if (!name || !memberCode) return res.status(400).json({ message: 'Нэр болон код шаардлагатай.' });
  const exists = await Member.findOne({ where: { memberCode } });
  if (exists) return res.status(400).json({ message: 'Энэ гишүүний код бүртгэлтэй.' });
  const type = memberTypeId ? await MemberType.findByPk(memberTypeId) : null;
  if (type?.requiresParent && !parentId && !parentAccountId && !parentName) {
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
    parentAccountId: parentAccountId || null,
    parentName,
    parentPhone,
    parentEmail,
    avatarUrl,
  });
  const created = await Member.findByPk(member.id, {
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }, { model: require('../models').Parent, as: 'parentAccount' }],
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
    'parentAccountId',
    'parentName',
    'parentPhone',
    'parentEmail',
  ]);
  if (data.memberTypeId) {
    const type = await MemberType.findByPk(data.memberTypeId);
    if (type?.isInactive) data.status = 'inactive';
    if (type?.requiresParent && !data.parentId && !data.parentAccountId && !data.parentName && !member.parentName) {
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

router.get('/product-categories', requirePermission('products.view'), async (_req, res) => {
  const categories = await ProductCategory.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
  const counts = await Product.findAll({
    attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['category'],
    raw: true,
  });
  const map = Object.fromEntries(counts.map((c) => [c.category, Number(c.count)]));
  res.json({
    categories: categories.map((c) => ({ ...serializeProductCategory(c), productCount: map[c.slug] || 0 })),
  });
});

router.post('/product-categories', requirePermission('products.manage'), async (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ message: 'Ангиллын нэр оруулна уу.' });
  const last = await ProductCategory.max('sortOrder');
  const category = await ProductCategory.create({
    name,
    slug: await uniqueSlug(req.body?.slug || name),
    sortOrder: Number.isFinite(Number(req.body?.sortOrder)) && req.body?.sortOrder !== ''
      ? Number(req.body.sortOrder)
      : (last || 0) + 1,
  });
  res.status(201).json({ category: serializeProductCategory(category) });
});

router.put('/product-categories/:id', requirePermission('products.manage'), async (req, res) => {
  const category = await ProductCategory.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Ангилал олдсонгүй.' });
  const name = String(req.body?.name ?? category.name).trim();
  if (!name) return res.status(400).json({ message: 'Ангиллын нэр оруулна уу.' });
  const updates = { name };
  if (req.body?.sortOrder !== undefined && req.body.sortOrder !== '') updates.sortOrder = Number(req.body.sortOrder) || 0;
  await sequelize.transaction(async (t) => {
    await category.update(updates, { transaction: t });
    await Product.update({ categoryLabel: name }, { where: { category: category.slug }, transaction: t });
  });
  res.json({ category: serializeProductCategory(category) });
});

router.delete('/product-categories/:id', requirePermission('products.manage'), async (req, res) => {
  const category = await ProductCategory.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Ангилал олдсонгүй.' });
  const used = await Product.count({ where: { category: category.slug } });
  if (used > 0) {
    return res.status(400).json({ message: `Энэ ангилалд ${used} бараа байна. Эхлээд барааг өөр ангилал руу шилжүүлнэ үү.` });
  }
  await category.destroy();
  res.json({ ok: true });
});

async function sanitizeProductInput(body, productId) {
  const input = {};
  for (const key of ['name', 'price', 'imageUrl', 'subtitle', 'description', 'features', 'inStock', 'sortOrder']) {
    if (body[key] !== undefined) input[key] = body[key];
  }
  if (input.price !== undefined) input.price = Math.max(0, Math.round(Number(input.price) || 0));
  if (input.sortOrder !== undefined) input.sortOrder = Number(input.sortOrder) || 0;
  if (input.features !== undefined && !Array.isArray(input.features)) input.features = [];

  if (body.images !== undefined) {
    input.images = (Array.isArray(body.images) ? body.images : [])
      .map((url) => String(url || '').trim())
      .filter(Boolean);
    input.imageUrl = input.images[0] || null;
  } else if (body.imageUrl !== undefined) {
    input.images = body.imageUrl ? [body.imageUrl] : [];
  }

  if (body.category !== undefined) {
    const category = await ProductCategory.findOne({ where: { slug: body.category } });
    if (!category) {
      const err = new Error('Ангилал олдсонгүй.');
      err.status = 400;
      throw err;
    }
    input.category = category.slug;
    input.categoryLabel = category.name;
  }

  if (body.relatedIds !== undefined) {
    const ids = [...new Set((Array.isArray(body.relatedIds) ? body.relatedIds : []).map(String))]
      .filter((id) => id !== productId);
    const existing = ids.length ? await Product.findAll({ where: { id: ids }, attributes: ['id'] }) : [];
    const valid = new Set(existing.map((p) => p.id));
    input.relatedIds = ids.filter((id) => valid.has(id));
  }
  return input;
}

router.get('/products', requirePermission('products.view'), async (req, res) => {
  const products = await Product.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'DESC']] });
  res.json({ products: products.map((p) => serializeProduct(p, req)) });
});

router.post('/products', requirePermission('products.manage'), async (req, res) => {
  try {
    const input = await sanitizeProductInput(req.body || {});
    if (!input.name) return res.status(400).json({ message: 'Барааны нэр оруулна уу.' });
    if (!input.category) return res.status(400).json({ message: 'Ангилал сонгоно уу.' });
    const product = await Product.create(input);
    res.status(201).json({ product: serializeProduct(product, req) });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.put('/products/:id', requirePermission('products.manage'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Бүтээгдэхүүн олдсонгүй.' });
  try {
    await product.update(await sanitizeProductInput(req.body || {}, product.id));
    res.json({ product: serializeProduct(product, req) });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

router.delete('/products/:id', requirePermission('products.manage'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Бүтээгдэхүүн олдсонгүй.' });
  await sequelize.transaction(async (t) => {
    await product.destroy({ transaction: t });
    const referencing = await Product.findAll({
      where: { relatedIds: { [Op.contains]: [product.id] } },
      transaction: t,
    });
    for (const p of referencing) {
      await p.update({ relatedIds: (p.relatedIds || []).filter((id) => id !== product.id) }, { transaction: t });
    }
  });
  res.json({ ok: true });
});

router.get('/competitions', requirePermission('competitions.view'), async (req, res) => {
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
      competitions.map((c) => serializeCompetitionAdmin(c, req, { joined: map[c.id] || 0 }))
    ),
  });
});

router.get('/competitions/:id', requirePermission('competitions.view'), async (req, res) => {
  const competition = await Competition.findByPk(req.params.id, {
    include: [{ model: MatchType, required: false }],
  });
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  res.json({ competition: await serializeCompetitionAdmin(competition, req) });
});

router.post('/competitions', requirePermission('competitions.manage'), async (req, res) => {
  const competition = await Competition.create(sanitizeCompetitionInput(req.body));
  res.status(201).json({ competition: await serializeCompetitionAdmin(competition, req, { joined: 0 }) });
});

router.put('/competitions/:id', requirePermission('competitions.manage'), async (req, res) => {
  const competition = await Competition.findByPk(req.params.id);
  if (!competition) return res.status(404).json({ message: 'Тэмцээн олдсонгүй.' });
  await competition.update(sanitizeCompetitionInput(req.body));
  await competition.reload({ include: [{ model: MatchType, required: false }] });
  res.json({ competition: await serializeCompetitionAdmin(competition, req) });
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
    include: [Member, Division],
    order: [['createdAt', 'DESC']],
  });
  res.json({ registrations: rows.map(serializeRegistration) });
});

router.put('/competitions/:id/registrations/:registrationId', requirePermission('competitions.manage'), async (req, res) => {
  const registration = await Registration.findOne({
    where: { id: req.params.registrationId, competitionId: req.params.id },
    include: [Member, Division],
  });
  if (!registration) return res.status(404).json({ message: 'Бүртгэл олдсонгүй.' });
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: 'Төлөв шаардлагатай.' });
  await registration.update({ status });
  res.json({ registration: serializeRegistration(registration) });
});

router.delete('/competitions/:id/registrations/:registrationId', requirePermission('competitions.manage'), async (req, res) => {
  const registration = await Registration.findOne({
    where: { id: req.params.registrationId, competitionId: req.params.id },
  });
  if (!registration) return res.status(404).json({ message: 'Бүртгэл олдсонгүй.' });
  await registration.destroy();
  res.json({ ok: true });
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
