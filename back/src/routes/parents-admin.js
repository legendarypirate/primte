const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Parent, Member, MemberType, Payment } = require('../models');
const { requireAdmin, requireAnyPermission, serializeParent } = require('../middleware/auth');
const { attachChildren, detachChild } = require('../services/memberParent');

const router = express.Router();

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const local = digits.replace(/^976/, '');
  return local.length >= 8 ? local.slice(-8) : (local || String(phone || '').trim());
}

async function hashSecret(value) {
  return bcrypt.hash(String(value).trim(), 10);
}

async function findParentByPhone(phone, excludeId) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  const digits = normalized.replace(/\D/g, '').replace(/^976/, '');
  const last8 = digits.length >= 8 ? digits.slice(-8) : digits;
  return Parent.findOne({
    where: {
      phone: { [Op.in]: [normalized, digits, last8, `+976${digits}`, `976${digits}`, `+976${last8}`, `976${last8}`].filter(Boolean) },
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
  });
}

async function parentPayload(parent) {
  const children = await Member.findAll({
    where: { parentAccountId: parent.id },
    attributes: ['id', 'name', 'memberCode', 'memberTypeId'],
    include: [MemberType],
  });
  const list = children.map((c) => ({
    id: c.id,
    name: c.name,
    memberCode: c.memberCode || null,
    memberType: c.MemberType?.name,
  }));
  return {
    ...serializeParent(parent),
    children: list,
    childrenCount: list.length,
  };
}

router.get('/', requireAdmin, requireAnyPermission('parents.view', 'members.view'), async (_req, res) => {
  const parents = await Parent.findAll({ order: [['name', 'ASC']] });
  const children = await Member.findAll({
    where: { parentAccountId: parents.map((p) => p.id) },
    attributes: ['id', 'name', 'memberCode', 'parentAccountId', 'memberTypeId'],
    include: [MemberType],
  });
  const childMap = children.reduce((acc, c) => {
    const key = c.parentAccountId;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      id: c.id,
      name: c.name,
      memberCode: c.memberCode || null,
      memberType: c.MemberType?.name,
    });
    return acc;
  }, {});
  res.json({
    parents: parents.map((p) => ({
      ...serializeParent(p),
      children: childMap[p.id] || [],
      childrenCount: (childMap[p.id] || []).length,
    })),
  });
});

router.get('/member-options', requireAdmin, requireAnyPermission('parents.view', 'parents.manage', 'members.view'), async (req, res) => {
  const q = String(req.query.q || '').trim();
  const where = q
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
          { memberCode: { [Op.iLike]: `%${q}%` } },
          { phone: { [Op.iLike]: `%${q}%` } },
          { username: { [Op.iLike]: `%${q}%` } },
        ],
      }
    : undefined;
  const members = await Member.findAll({
    where,
    attributes: ['id', 'name', 'memberCode', 'phone', 'username'],
    include: [{ model: MemberType, attributes: ['name'] }],
    order: [['name', 'ASC']],
    limit: 400,
  });
  res.json({
    members: members.map((m) => ({
      id: m.id,
      name: m.name,
      memberCode: m.memberCode || null,
      phone: m.phone || null,
      username: m.username || null,
      memberType: m.MemberType?.name || null,
    })),
  });
});

router.post('/', requireAdmin, requireAnyPermission('parents.manage', 'members.create'), async (req, res) => {
  const { name, phone, email, avatarUrl, password, code } = req.body || {};
  const secret = String(password || code || '').trim();
  if (!name || !phone || !secret) {
    return res.status(400).json({ message: 'Нэр, утас, нууц үг шаардлагатай.' });
  }
  const normalized = normalizePhone(phone);
  if (await findParentByPhone(normalized)) {
    return res.status(400).json({ message: 'Энэ утас бүртгэлтэй.' });
  }
  const hash = await hashSecret(secret);
  const parent = await Parent.create({
    name: String(name).trim(),
    phone: normalized,
    email: email || null,
    avatarUrl: avatarUrl || null,
    pinHash: hash,
    passwordHash: hash,
  });
  res.status(201).json({ parent: await parentPayload(parent) });
});

router.put('/:id', requireAdmin, requireAnyPermission('parents.manage', 'members.update'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  const { name, phone, email, avatarUrl, password, code } = req.body || {};
  if (name) parent.name = String(name).trim();
  if (phone) {
    const normalized = normalizePhone(phone);
    if (await findParentByPhone(normalized, parent.id)) {
      return res.status(400).json({ message: 'Энэ утас бүртгэлтэй.' });
    }
    parent.phone = normalized;
  }
  if (email !== undefined) parent.email = email || null;
  if (avatarUrl !== undefined) parent.avatarUrl = avatarUrl || null;
  const secret = String(password || code || '').trim();
  if (secret) {
    const hash = await hashSecret(secret);
    parent.pinHash = hash;
    parent.passwordHash = hash;
  }
  await parent.save();
  await Member.update(
    { parentName: parent.name, parentPhone: parent.phone, parentEmail: parent.email },
    { where: { parentAccountId: parent.id } }
  );
  res.json({ parent: await parentPayload(parent) });
});

router.post('/:id/children', requireAdmin, requireAnyPermission('parents.manage', 'members.update'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  try {
    await attachChildren(parent, req.body?.memberIds);
  } catch (err) {
    return res.status(err.status || 400).json({ message: err.message });
  }
  res.json({ parent: await parentPayload(parent) });
});

router.delete('/:id/children/:childId', requireAdmin, requireAnyPermission('parents.manage', 'members.update'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  try {
    await detachChild(parent, req.params.childId);
  } catch (err) {
    return res.status(err.status || 400).json({ message: err.message });
  }
  res.json({ parent: await parentPayload(parent) });
});

router.delete('/:id', requireAdmin, requireAnyPermission('parents.manage', 'members.delete'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  await Payment.destroy({ where: { parentId: parent.id } });
  await Member.update(
    { parentAccountId: null, parentName: null, parentPhone: null, parentEmail: null },
    { where: { parentAccountId: parent.id } }
  );
  await parent.destroy();
  res.json({ ok: true });
});

module.exports = router;
