const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Admin, Member, Parent, Role, MemberType, DevelopmentActivity } = require('../models');
const { signToken, requireAdmin, requireParent, serializeAdmin, serializeParent } = require('../middleware/auth');
const { serializeMember } = require('../utils/helpers');

const router = express.Router();

router.post('/admin/login', async (req, res) => {
  const { email, username, password } = req.body || {};
  const identifier = String(username || email || '').trim();
  if (!identifier) {
    return res.status(400).json({ message: 'Нэвтрэх нэр эсвэл имэйл оруулна уу.' });
  }
  const where = identifier.includes('@')
    ? { email: identifier.toLowerCase() }
    : { username: identifier.toLowerCase() };
  const admin = await Admin.findOne({ where, include: [Role] });
  if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) {
    return res.status(401).json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу.' });
  }
  return res.json({
    token: signToken({ id: admin.id, role: 'admin' }),
    admin: serializeAdmin(admin),
  });
});

router.post('/member/login', async (req, res) => {
  const { name, code } = req.body || {};
  if (!name || !code) {
    return res.status(400).json({ message: 'Нэр болон нэвтрэх кодоо оруулна уу.' });
  }
  const typedName = String(name).trim().toLowerCase();
  const secret = String(code).trim();
  const include = [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }];
  const sameName = (member) => member.name.trim().toLowerCase() === typedName;

  let member = await Member.findOne({ where: { memberCode: secret }, include });
  let ok = false;
  if (member && sameName(member)) {
    ok = Boolean(member.pinHash) && (await bcrypt.compare(secret, member.pinHash));
    if (!ok && member.passwordHash) ok = await bcrypt.compare(secret, member.passwordHash);
  } else {
    member = null;
  }

  if (!ok) {
    const candidates = await Member.findAll({ where: { name: { [Op.iLike]: String(name).trim() } }, include });
    for (const candidate of candidates) {
      if (!sameName(candidate) || !candidate.passwordHash) continue;
      if (await bcrypt.compare(secret, candidate.passwordHash)) {
        member = candidate;
        ok = true;
        break;
      }
    }
  }

  if (!member || !ok) return res.status(401).json({ message: 'Гишүүн олдсонгүй эсвэл нэвтрэх код буруу.' });
  const type = member.MemberType;
  if (member.status !== 'active' || (type && type.hasAppAccess === false)) {
    return res.status(401).json({ message: 'Гишүүн идэвхгүй байна.' });
  }
  return res.json({
    token: signToken({ id: member.id, role: 'member' }),
    member: serializeMember(member, req),
  });
});

router.get('/admin/me', requireAdmin, (req, res) => {
  res.json({ admin: serializeAdmin(req.admin) });
});

router.post('/parent/login', async (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) {
    return res.status(400).json({ message: 'Утас болон нэвтрэх кодоо оруулна уу.' });
  }
  const normalized = String(phone).replace(/\s+/g, '');
  const parent = await Parent.findOne({
    where: {
      phone: {
        [require('sequelize').Op.or]: [normalized, normalized.replace(/^\+976/, ''), `+976${normalized.replace(/^\+976/, '')}`],
      },
    },
  });
  if (!parent) {
    return res.status(401).json({ message: 'Эцэг эхийн бүртгэл олдсонгүй.' });
  }
  const ok = await bcrypt.compare(String(code).trim(), parent.pinHash);
  if (!ok) return res.status(401).json({ message: 'Нэвтрэх код буруу.' });
  return res.json({
    token: signToken({ id: parent.id, role: 'parent' }),
    parent: serializeParent(parent),
    role: 'parent',
  });
});

router.get('/parent/me', async (req, res, next) => {
  return requireParent(req, res, () => res.json({ parent: serializeParent(req.parent), role: 'parent' }));
});

router.get('/member/me', async (req, res, next) => {
  const { requireMember } = require('../middleware/auth');
  return requireMember(req, res, () => res.json({ member: serializeMember(req.member, req) }));
});

module.exports = router;
