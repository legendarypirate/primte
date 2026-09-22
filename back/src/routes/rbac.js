const express = require('express');
const bcrypt = require('bcryptjs');
const { Role, Admin, MemberType, DevelopmentActivity, MatchType, Division } = require('../models');
const { requireAdmin, requirePermission, serializeAdmin } = require('../middleware/auth');
const { PERMISSIONS, groupedPermissions } = require('../rbac/catalog');

const router = express.Router();
router.use(requireAdmin);

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

router.get('/permissions', requirePermission('roles.manage'), (_req, res) => {
  res.json({ permissions: PERMISSIONS, grouped: groupedPermissions() });
});

router.get('/roles', requirePermission('roles.manage'), async (_req, res) => {
  const roles = await Role.findAll({ order: [['sortOrder', 'ASC']] });
  res.json({ roles });
});

router.post('/roles', requirePermission('roles.manage'), async (req, res) => {
  const { name, description, permissions, isSuper } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Нэр шаардлагатай.' });
  const role = await Role.create({
    name,
    slug: slugify(name),
    description,
    permissions: permissions || [],
    isSuper: Boolean(isSuper),
    isSystem: false,
    sortOrder: 99,
  });
  res.status(201).json({ role });
});

router.put('/roles/:id', requirePermission('roles.manage'), async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ message: 'Role олдсонгүй.' });
  const data = {};
  if (req.body.name !== undefined) data.name = req.body.name;
  if (req.body.description !== undefined) data.description = req.body.description;
  if (req.body.permissions !== undefined) data.permissions = req.body.permissions;
  if (req.body.isSuper !== undefined && !role.isSystem) data.isSuper = req.body.isSuper;
  await role.update(data);
  res.json({ role });
});

router.delete('/roles/:id', requirePermission('roles.manage'), async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return res.status(404).json({ message: 'Role олдсонгүй.' });
  if (role.isSystem) return res.status(400).json({ message: 'Системийн role устгах боломжгүй.' });
  const used = await Admin.count({ where: { roleId: role.id } });
  if (used) return res.status(400).json({ message: 'Энэ role-д админ холбогдсон байна.' });
  await role.destroy();
  res.json({ ok: true });
});

router.get('/member-types', requirePermission('member_types.manage'), async (_req, res) => {
  const memberTypes = await MemberType.findAll({ order: [['sortOrder', 'ASC']] });
  res.json({ memberTypes });
});

router.post('/member-types', requirePermission('member_types.manage'), async (req, res) => {
  const { name, category, level, isInactive, requiresParent, hasAppAccess } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Нэр шаардлагатай.' });
  const memberType = await MemberType.create({
    name,
    slug: slugify(name),
    category: category || 'official',
    level: level || null,
    isInactive: Boolean(isInactive),
    requiresParent: Boolean(requiresParent),
    hasAppAccess: hasAppAccess !== false && !isInactive,
    isSystem: false,
    sortOrder: 99,
  });
  res.status(201).json({ memberType });
});

router.put('/member-types/:id', requirePermission('member_types.manage'), async (req, res) => {
  const memberType = await MemberType.findByPk(req.params.id);
  if (!memberType) return res.status(404).json({ message: 'Төрөл олдсонгүй.' });
  await memberType.update({
    name: req.body.name ?? memberType.name,
    category: req.body.category ?? memberType.category,
    level: req.body.level === undefined ? memberType.level : req.body.level,
    isInactive: req.body.isInactive ?? memberType.isInactive,
    requiresParent: req.body.requiresParent ?? memberType.requiresParent,
    hasAppAccess: req.body.hasAppAccess ?? memberType.hasAppAccess,
  });
  res.json({ memberType });
});

router.delete('/member-types/:id', requirePermission('member_types.manage'), async (req, res) => {
  const memberType = await MemberType.findByPk(req.params.id);
  if (!memberType) return res.status(404).json({ message: 'Төрөл олдсонгүй.' });
  if (memberType.isSystem) return res.status(400).json({ message: 'Системийн төрөл устгах боломжгүй.' });
  await memberType.destroy();
  res.json({ ok: true });
});

router.get('/development-activities', requirePermission('activities.manage'), async (_req, res) => {
  const activities = await DevelopmentActivity.findAll({ order: [['sortOrder', 'ASC']] });
  res.json({ activities });
});

router.post('/development-activities', requirePermission('activities.manage'), async (req, res) => {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Нэр шаардлагатай.' });
  const activity = await DevelopmentActivity.create({
    name,
    slug: slugify(name),
    description,
    isSystem: false,
    sortOrder: 99,
  });
  res.status(201).json({ activity });
});

router.put('/development-activities/:id', requirePermission('activities.manage'), async (req, res) => {
  const activity = await DevelopmentActivity.findByPk(req.params.id);
  if (!activity) return res.status(404).json({ message: 'Activity олдсонгүй.' });
  await activity.update({
    name: req.body.name ?? activity.name,
    description: req.body.description ?? activity.description,
  });
  res.json({ activity });
});

router.delete('/development-activities/:id', requirePermission('activities.manage'), async (req, res) => {
  const activity = await DevelopmentActivity.findByPk(req.params.id);
  if (!activity) return res.status(404).json({ message: 'Activity олдсонгүй.' });
  if (activity.isSystem) return res.status(400).json({ message: 'Системийн activity устгах боломжгүй.' });
  await activity.destroy();
  res.json({ ok: true });
});

router.get('/match-types', requirePermission('match_types.manage'), async (_req, res) => {
  const matchTypes = await MatchType.findAll({ order: [['name', 'ASC']] });
  res.json({ matchTypes });
});

router.post('/match-types', requirePermission('match_types.manage'), async (req, res) => {
  const { name, comment } = req.body || {};
  if (!name) return res.status(400).json({ message: 'Нэр шаардлагатай.' });
  const matchType = await MatchType.create({ name, comment });
  res.status(201).json({ matchType });
});

router.put('/match-types/:id', requirePermission('match_types.manage'), async (req, res) => {
  const matchType = await MatchType.findByPk(req.params.id);
  if (!matchType) return res.status(404).json({ message: 'Match type олдсонгүй.' });
  await matchType.update({
    name: req.body.name ?? matchType.name,
    comment: req.body.comment ?? matchType.comment,
  });
  res.json({ matchType });
});

router.delete('/match-types/:id', requirePermission('match_types.manage'), async (req, res) => {
  const matchType = await MatchType.findByPk(req.params.id);
  if (!matchType) return res.status(404).json({ message: 'Match type олдсонгүй.' });
  await matchType.destroy();
  res.json({ ok: true });
});

router.get('/divisions', requirePermission('divisions.manage'), async (_req, res) => {
  const divisions = await Division.findAll({ order: [['abbreviation', 'ASC']] });
  res.json({ divisions });
});

router.post('/divisions', requirePermission('divisions.manage'), async (req, res) => {
  const { abbreviation, name, description } = req.body || {};
  if (!abbreviation) return res.status(400).json({ message: 'Товчлол шаардлагатай.' });
  if (!name) return res.status(400).json({ message: 'Нэр шаардлагатай.' });
  const division = await Division.create({ abbreviation, name, description });
  res.status(201).json({ division });
});

router.put('/divisions/:id', requirePermission('divisions.manage'), async (req, res) => {
  const division = await Division.findByPk(req.params.id);
  if (!division) return res.status(404).json({ message: 'Division олдсонгүй.' });
  await division.update({
    abbreviation: req.body.abbreviation ?? division.abbreviation,
    name: req.body.name ?? division.name,
    description: req.body.description ?? division.description,
  });
  res.json({ division });
});

router.delete('/divisions/:id', requirePermission('divisions.manage'), async (req, res) => {
  const division = await Division.findByPk(req.params.id);
  if (!division) return res.status(404).json({ message: 'Division олдсонгүй.' });
  await division.destroy();
  res.json({ ok: true });
});

router.get('/staff', requirePermission('staff.manage'), async (_req, res) => {
  const staff = await Admin.findAll({ include: [Role], order: [['createdAt', 'DESC']] });
  res.json({ staff: staff.map(serializeAdmin) });
});

router.post('/staff', requirePermission('staff.manage'), async (req, res) => {
  const { name, email, password, roleId } = req.body || {};
  if (!name || !email || !password || !roleId) {
    return res.status(400).json({ message: 'Нэр, имэйл, нууц үг, role шаардлагатай.' });
  }
  const exists = await Admin.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Имэйл бүртгэлтэй.' });
  const admin = await Admin.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    roleId,
  });
  const created = await Admin.findByPk(admin.id, { include: [Role] });
  res.status(201).json({ admin: serializeAdmin(created) });
});

router.put('/staff/:id', requirePermission('staff.manage'), async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Админ олдсонгүй.' });
  const data = {};
  if (req.body.name) data.name = req.body.name;
  if (req.body.email) data.email = req.body.email;
  if (req.body.roleId) data.roleId = req.body.roleId;
  if (req.body.password) data.passwordHash = await bcrypt.hash(req.body.password, 10);
  await admin.update(data);
  const updated = await Admin.findByPk(admin.id, { include: [Role] });
  res.json({ admin: serializeAdmin(updated) });
});

router.delete('/staff/:id', requirePermission('staff.manage'), async (req, res) => {
  if (req.params.id === req.admin.id) {
    return res.status(400).json({ message: 'Өөрийгөө устгах боломжгүй.' });
  }
  const admin = await Admin.findByPk(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Админ олдсонгүй.' });
  await admin.destroy();
  res.json({ ok: true });
});

module.exports = router;
