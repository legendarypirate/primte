const express = require('express');
const bcrypt = require('bcryptjs');
const { Parent, Member, MemberType } = require('../models');
const { requireAdmin, requirePermission, serializeParent } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAdmin, requirePermission('members.view'), async (_req, res) => {
  const parents = await Parent.findAll({ order: [['name', 'ASC']] });
  const children = await Member.findAll({
    where: { parentAccountId: parents.map((p) => p.id) },
    attributes: ['id', 'name', 'parentAccountId', 'memberTypeId'],
    include: [MemberType],
  });
  const childMap = children.reduce((acc, c) => {
    const key = c.parentAccountId;
    if (!acc[key]) acc[key] = [];
    acc[key].push({ id: c.id, name: c.name, memberType: c.MemberType?.name });
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

router.post('/', requireAdmin, requirePermission('members.manage'), async (req, res) => {
  const { name, phone, code, email } = req.body || {};
  if (!name || !phone || !code) {
    return res.status(400).json({ message: 'Нэр, утас, код шаардлагатай.' });
  }
  const parent = await Parent.create({
    name,
    phone: String(phone).trim(),
    pinHash: await bcrypt.hash(String(code).trim(), 10),
    email,
  });
  res.status(201).json({ parent: serializeParent(parent) });
});

router.put('/:id', requireAdmin, requirePermission('members.manage'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  const { name, phone, email, code } = req.body || {};
  if (name) parent.name = name;
  if (phone) parent.phone = String(phone).trim();
  if (email !== undefined) parent.email = email;
  if (code) parent.pinHash = await bcrypt.hash(String(code).trim(), 10);
  await parent.save();
  res.json({ parent: serializeParent(parent) });
});

router.delete('/:id', requireAdmin, requirePermission('members.manage'), async (req, res) => {
  const parent = await Parent.findByPk(req.params.id);
  if (!parent) return res.status(404).json({ message: 'Эцэг эх олдсонгүй.' });
  await Member.update({ parentAccountId: null }, { where: { parentAccountId: parent.id } });
  await parent.destroy();
  res.json({ ok: true });
});

module.exports = router;
