const express = require('express');
const { Op } = require('sequelize');
const {
  Member,
  MemberType,
  DevelopmentActivity,
  Attendance,
  MemberProgress,
  Transaction,
  Order,
  OrderItem,
  Product,
  Payment,
  Notice,
  Setting,
  sequelize,
} = require('../models');
const { requireParent } = require('../middleware/auth');
const {
  serializeMember,
  serializeChildSummary,
  serializeAttendance,
  serializeProgress,
  serializePurchase,
  formatDate,
  formatTime,
} = require('../utils/helpers');

const router = express.Router();
router.use(requireParent);

async function getChildForParent(parentId, childId) {
  return Member.findOne({
    where: { id: childId, parentAccountId: parentId },
    include: [MemberType, DevelopmentActivity, { model: MemberProgress, as: 'progress' }],
  });
}

router.get('/home', async (req, res) => {
  const children = await Member.findAll({
    where: { parentAccountId: req.parent.id },
    include: [MemberType],
    order: [['name', 'ASC']],
  });
  const clubSetting = await Setting.findByPk('club');
  const notices = await Notice.findAll({
    where: { published: true },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });
  res.json({
    parent: {
      id: req.parent.id,
      name: req.parent.name,
      phone: req.parent.phone,
      avatarUrl: req.parent.avatarUrl,
    },
    children: children.map((c) => serializeChildSummary(c, req)),
    club: clubSetting?.value || { open: true, todayCount: 0, capacity: 40 },
    notices,
    unreadNotices: notices.length,
  });
});

router.get('/children', async (req, res) => {
  const children = await Member.findAll({
    where: { parentAccountId: req.parent.id },
    include: [MemberType],
    order: [['name', 'ASC']],
  });
  res.json({ children: children.map((c) => serializeChildSummary(c, req)) });
});

router.get('/children/:id', async (req, res) => {
  const child = await getChildForParent(req.parent.id, req.params.id);
  if (!child) return res.status(404).json({ message: 'Хүүхэд олдсонгүй.' });

  const recentAttendance = await Attendance.findAll({
    where: { memberId: child.id },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });
  const recentTx = await Transaction.findAll({
    where: { memberId: child.id },
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthAttendance = await Attendance.count({
    where: { memberId: child.id, createdAt: { [Op.gte]: monthStart } },
  });

  res.json({
    child: serializeMember(child, req),
    summary: serializeChildSummary(child, req, { attendancePercent: calcAttendancePercent(monthAttendance) }),
    progress: child.progress ? serializeProgress(child.progress) : null,
    recentActivity: [
      ...recentAttendance.map((a) => ({
        type: 'attendance',
        title: a.title || 'Клубт ирсэн',
        subtitle: a.kind === 'training' ? 'Сургалт' : 'Ирц',
        dateLabel: formatDate(a.createdAt),
        timeLabel: formatTime(a.createdAt),
      })),
      ...recentTx.map((t) => ({
        type: t.kind,
        title: t.title,
        subtitle: formatMntLabel(t.amount),
        dateLabel: formatDate(t.createdAt),
        timeLabel: formatTime(t.createdAt),
      })),
    ].slice(0, 6),
  });
});

router.get('/children/:id/attendance', async (req, res) => {
  const child = await getChildForParent(req.parent.id, req.params.id);
  if (!child) return res.status(404).json({ message: 'Хүүхэд олдсонгүй.' });

  const year = Number(req.query.year) || new Date().getFullYear();
  const month = Number(req.query.month) || new Date().getMonth() + 1;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const records = await Attendance.findAll({
    where: { memberId: child.id, createdAt: { [Op.between]: [start, end] } },
    order: [['createdAt', 'DESC']],
  });

  const attended = records.length;
  const missed = Math.max(0, Math.round(attended * 0.08));
  const goal = 12;

  res.json({
    month: `${year} оны ${month} сар`,
    attended,
    missed,
    goal,
    percent: calcAttendancePercent(attended, goal),
    calendarDays: records.map((r) => ({
      day: new Date(r.createdAt).getDate(),
      kind: r.kind,
    })),
    logs: records.map((r) => serializeAttendance(r)),
  });
});

router.get('/children/:id/progress', async (req, res) => {
  const child = await getChildForParent(req.parent.id, req.params.id);
  if (!child) return res.status(404).json({ message: 'Хүүхэд олдсонгүй.' });

  let progress = child.progress;
  if (!progress) {
    progress = await MemberProgress.findOne({ where: { memberId: child.id } });
  }

  res.json({
    child: serializeChildSummary(child, req),
    progress: progress
      ? serializeProgress(progress)
      : {
          accuracy: 82,
          speed: 76,
          stability: 89,
          tactical: 73,
          safety: 96,
          period: '3m',
          history: [{ label: 'Нарийвчлал', delta: '+18%', period: 'Сүүлийн 3 сар' }],
        },
  });
});

router.get('/children/:id/purchases', async (req, res) => {
  const child = await getChildForParent(req.parent.id, req.params.id);
  if (!child) return res.status(404).json({ message: 'Хүүхэд олдсонгүй.' });

  const category = req.query.category;
  const orders = await Order.findAll({
    where: { memberId: child.id },
    include: [{ model: OrderItem, as: 'items', include: [Product] }],
    order: [['createdAt', 'DESC']],
  });

  let purchases = [];
  for (const order of orders) {
    for (const item of order.items || []) {
      purchases.push(serializePurchase(item, order, req));
    }
  }

  const feeTx = await Transaction.findAll({
    where: { memberId: child.id, kind: { [Op.in]: ['fee', 'purchase'] } },
    order: [['createdAt', 'DESC']],
  });
  for (const tx of feeTx) {
    if (tx.kind === 'fee') {
      purchases.push({
        id: tx.id,
        title: tx.title,
        amount: Math.abs(tx.amount),
        dateLabel: formatDate(tx.createdAt),
        category: 'training',
        categoryLabel: 'Сургалт',
        image: null,
      });
    }
  }

  if (category && category !== 'all') {
    purchases = purchases.filter((p) => p.category === category);
  }

  purchases.sort((a, b) => b.dateLabel.localeCompare(a.dateLabel));
  res.json({ purchases });
});

router.post('/wallet/topup', async (req, res) => {
  const { memberId, amount, method = 'qpay', description } = req.body || {};
  if (!memberId || !amount || amount < 1000) {
    return res.status(400).json({ message: 'Гишүүн болон дүн зөв оруулна уу.' });
  }
  const child = await getChildForParent(req.parent.id, memberId);
  if (!child) return res.status(404).json({ message: 'Хүүхэд олдсонгүй.' });

  const ref = `QP${Date.now()}`;
  const payment = await Payment.create({
    parentId: req.parent.id,
    memberId: child.id,
    amount: Number(amount),
    method,
    status: 'pending',
    referenceId: ref,
    description: description || `${child.name} - PRIME Wallet цэнэглэх`,
  });

  res.json({
    payment: {
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      referenceId: payment.referenceId,
      description: payment.description,
      memberName: child.name,
    },
  });
});

router.post('/wallet/topup/:id/confirm', async (req, res) => {
  const payment = await Payment.findOne({
    where: { id: req.params.id, parentId: req.parent.id },
  });
  if (!payment) return res.status(404).json({ message: 'Төлбөр олдсонгүй.' });
  if (payment.status === 'paid') {
    return res.json({ ok: true, payment, newBalance: null });
  }

  const result = await sequelize.transaction(async (t) => {
    const child = await Member.findByPk(payment.memberId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!child) throw new Error('Хүүхэд олдсонгүй.');

    child.walletBalance += payment.amount;
    await child.save({ transaction: t });
    payment.status = 'paid';
    await payment.save({ transaction: t });
    await Transaction.create(
      {
        memberId: child.id,
        title: 'Wallet цэнэглэл (QPay)',
        amount: payment.amount,
        kind: 'topup',
      },
      { transaction: t },
    );
    return child.walletBalance;
  });

  res.json({
    ok: true,
    payment: {
      id: payment.id,
      referenceId: payment.referenceId,
      amount: payment.amount,
      status: 'paid',
      dateLabel: formatDate(new Date()),
      timeLabel: formatTime(new Date()),
    },
    newBalance: result,
  });
});

router.get('/notices', async (_req, res) => {
  const notices = await Notice.findAll({
    where: { published: true },
    order: [['createdAt', 'DESC']],
  });
  res.json({ notices });
});

function calcAttendancePercent(attended, goal = 12) {
  return Math.min(100, Math.round((attended / goal) * 100));
}

function formatMntLabel(amount) {
  const sign = amount < 0 ? '-' : '';
  return `${sign}₮ ${Math.abs(amount).toLocaleString('en-US')}`;
}

module.exports = router;
