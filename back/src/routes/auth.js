const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Admin, Judge, Member, Parent, Role, MemberType, DevelopmentActivity } = require('../models');
const {
  signToken,
  requireAdmin,
  requireJudge,
  requireParent,
  serializeAdmin,
  serializeJudge,
  serializeParent,
} = require('../middleware/auth');
const { serializeMember } = require('../utils/helpers');
const { resolveMemberNames } = require('../domain/names');
const { nextStudentCode } = require('../services/memberProgression');

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
  const { name, username, code } = req.body || {};
  const login = String(username || name || '').trim();
  if (!login || !code) {
    return res.status(400).json({ message: 'Нэвтрэх нэр болон нууц үгээ оруулна уу.' });
  }
  const typed = login.toLowerCase();
  const secret = String(code).trim();
  const include = [MemberType, DevelopmentActivity, { model: DevelopmentActivity, as: 'developmentActivities' }, { model: Member, as: 'parent' }];
  const matchesLogin = (member) =>
    (member.username && member.username.toLowerCase() === typed) ||
    member.name.trim().toLowerCase() === typed;

  let member =
    (await Member.findOne({ where: { username: typed }, include })) ||
    (await Member.findOne({ where: { name: { [Op.iLike]: login } }, include }));
  let ok = false;
  if (member && matchesLogin(member)) {
    if (member.passwordHash) ok = await bcrypt.compare(secret, member.passwordHash);
    if (!ok && member.pinHash) ok = await bcrypt.compare(secret, member.pinHash);
  } else {
    member = null;
  }

  if (!member || !ok) return res.status(401).json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу.' });
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

async function hashMatches(secret, hash) {
  if (!hash) return false;
  return bcrypt.compare(String(secret), hash);
}

router.post('/judge/login', async (req, res) => {
  const { username, password } = req.body || {};
  const login = String(username || '').trim().toLowerCase();
  if (!login || !password) {
    return res.status(400).json({ message: 'Нэвтрэх нэр болон нууц үгээ оруулна уу.' });
  }
  const member = await Member.findOne({ where: { username: { [Op.iLike]: login } } });
  let judge = member ? await Judge.findOne({ where: { memberId: member.id } }) : null;
  if (!judge) judge = await Judge.findOne({ where: { username: login } });

  const memberPassOk = await hashMatches(password, member?.passwordHash);
  const judgePassOk = await hashMatches(password, judge?.passwordHash);

  if (!judge || !judge.active) {
    if (memberPassOk) {
      return res.status(403).json({ message: 'Энэ гишүүнд шүүгчийн эрх алга. Админ Шүүгчид хуудсанд нэмнэ үү.' });
    }
    return res.status(401).json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу.' });
  }
  if (!memberPassOk && !judgePassOk) {
    return res.status(401).json({ message: 'Нэвтрэх нэр эсвэл нууц үг буруу.' });
  }
  return res.json({
    token: signToken({ id: judge.id, role: 'judge' }),
    judge: serializeJudge(judge),
  });
});

router.get('/judge/me', requireJudge, (req, res) => {
  res.json({ judge: serializeJudge(req.judge) });
});

function parentPhoneCandidates(phone) {
  const raw = String(phone || '').trim();
  const digits = raw.replace(/\D/g, '');
  const local = digits.replace(/^976/, '');
  const last8 = local.length >= 8 ? local.slice(-8) : local;
  return [...new Set([raw, digits, local, last8, `+976${local}`, `976${local}`, `+976${last8}`, `976${last8}`].filter(Boolean))];
}

router.post('/parent/login', async (req, res) => {
  const { phone, password, code } = req.body || {};
  const secret = String(password || code || '').trim();
  if (!phone || !secret) {
    return res.status(400).json({ message: 'Утас болон нууц үгээ оруулна уу.' });
  }
  const parent = await Parent.findOne({
    where: { phone: { [Op.in]: parentPhoneCandidates(phone) } },
  });
  if (!parent) {
    return res.status(401).json({ message: 'Эцэг эхийн бүртгэл олдсонгүй.' });
  }
  let ok = false;
  if (parent.passwordHash) ok = await bcrypt.compare(secret, parent.passwordHash);
  if (!ok && parent.pinHash) ok = await bcrypt.compare(secret, parent.pinHash);
  if (!ok) return res.status(401).json({ message: 'Утас эсвэл нууц үг буруу.' });
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

router.post('/member/forgot-password', async (req, res) => {
  const { username, phone } = req.body || {};
  if (!String(username || '').trim() && !String(phone || '').trim()) {
    return res.status(400).json({ message: 'Нэвтрэх нэр эсвэл утасны дугаар оруулна уу.' });
  }
  return res.json({ message: 'Хүсэлт хүлээн авлаа. Админ тантай холбогдоно.' });
});

router.post('/member/register', async (req, res) => {
  const { firstName, lastName, username, phone, password } = req.body || {};
  const names = resolveMemberNames({ firstName, lastName });
  if (!names.name) return res.status(400).json({ message: 'Овог, нэр оруулна уу.' });
  const loginName = String(username || '').trim().toLowerCase();
  if (!loginName) return res.status(400).json({ message: 'Нэвтрэх нэр шаардлагатай.' });
  const phoneValue = String(phone || '').trim();
  if (phoneValue.replace(/\D/g, '').length < 8) {
    return res.status(400).json({ message: 'Утасны дугаар оруулна уу.' });
  }
  if (!password || String(password).trim().length < 4) {
    return res.status(400).json({ message: 'Нууц үг хамгийн багадаа 4 тэмдэгт байна.' });
  }
  const usernameTaken = await Member.findOne({ where: { username: loginName } });
  if (usernameTaken) return res.status(400).json({ message: 'Энэ нэвтрэх нэр бүртгэлтэй.' });
  const studentType = await MemberType.findOne({ where: { slug: 'student-member' } });
  const code = await nextStudentCode();
  const hash = await bcrypt.hash(String(password).trim(), 10);
  await Member.create({
    name: names.name,
    firstName: names.firstName,
    lastName: names.lastName,
    username: loginName,
    memberCode: code,
    pinHash: hash,
    passwordHash: hash,
    phone: phoneValue,
    status: 'inactive',
    memberTypeId: studentType?.id || null,
  });
  return res.status(201).json({ message: 'Бүртгэл амжилттай. Админ баталгаажуулсны дараа нэвтэрнэ.' });
});

module.exports = router;
