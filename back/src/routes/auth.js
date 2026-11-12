const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { Admin, Judge, Member, Parent, Role, MemberType, DevelopmentActivity } = require('../models');
const {
  signToken,
  readToken,
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
const { formatPhone, isValidMnPhone, normalizePhone } = require('../utils/phone');
const {
  consumeVerifySession,
  createVerifyMnSession,
  getRememberedSession,
  getVerifyMnSession,
  pruneVerifySessions,
  rememberVerifySession,
} = require('../services/verifyMn');

const memberAuthInclude = [
  MemberType,
  DevelopmentActivity,
  { model: DevelopmentActivity, as: 'developmentActivities' },
  { model: Member, as: 'parent' },
];

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

async function findMemberByLogin(login, include) {
  const typed = String(login || '').trim().toLowerCase();
  const digits = normalizePhone(login);
  if (digits) {
    const byUsername = await Member.findOne({ where: { username: digits }, include });
    if (byUsername) return byUsername;
    const phoneHit = await findMemberByPhone(digits);
    if (phoneHit) return Member.findByPk(phoneHit.id, { include });
  }
  return (
    (await Member.findOne({ where: { username: typed }, include })) ||
    (await Member.findOne({ where: { name: { [Op.iLike]: String(login || '').trim() } }, include }))
  );
}

router.post('/member/login', async (req, res) => {
  const { name, username, phone, code } = req.body || {};
  const login = String(username || phone || name || '').trim();
  if (!login || !code) {
    return res.status(400).json({ message: 'Утасны дугаар болон нууц үгээ оруулна уу.' });
  }
  const secret = String(code).trim();
  const include = memberAuthInclude;
  const member = await findMemberByLogin(login, include);
  let ok = false;
  if (member) {
    if (member.passwordHash) ok = await bcrypt.compare(secret, member.passwordHash);
    if (!ok && member.pinHash) ok = await bcrypt.compare(secret, member.pinHash);
  }

  if (!member || !ok) return res.status(401).json({ message: 'Утасны дугаар эсвэл нууц үг буруу.' });
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

function sendAuthError(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ message: err.message || 'Алдаа гарлаа' });
}

async function findMemberByPhone(phone) {
  const digits = normalizePhone(phone);
  const members = await Member.findAll({
    where: { phone: { [Op.ne]: null } },
    attributes: ['id', 'phone'],
  });
  return members.find((member) => normalizePhone(member.phone) === digits) || null;
}

async function createVerifiedMember(pending) {
  const usernameTaken = await Member.findOne({ where: { username: pending.username } });
  if (usernameTaken) {
    const err = new Error('Энэ утасны дугаар бүртгэлтэй.');
    err.statusCode = 400;
    throw err;
  }
  const phoneTaken = await findMemberByPhone(pending.phone);
  if (phoneTaken) {
    const err = new Error('Энэ утас өөр бүртгэлд холбогдсон байна.');
    err.statusCode = 409;
    throw err;
  }

  const studentType = await MemberType.findOne({ where: { slug: 'student-member' } });
  const code = await nextStudentCode();
  const created = await Member.create({
    name: pending.name,
    firstName: pending.firstName,
    lastName: pending.lastName,
    username: pending.username,
    memberCode: code,
    pinHash: pending.passwordHash,
    passwordHash: pending.passwordHash,
    phone: formatPhone(pending.phone),
    status: 'active',
    memberTypeId: studentType?.id || null,
  });
  return Member.findByPk(created.id, { include: memberAuthInclude });
}

router.post('/member/register', async (req, res) => {
  try {
    pruneVerifySessions();
    const { firstName, lastName, phone, password } = req.body || {};
    const names = resolveMemberNames({ firstName, lastName });
    if (!names.name) return res.status(400).json({ message: 'Овог, нэр оруулна уу.' });
    if (!isValidMnPhone(phone)) {
      return res.status(400).json({ message: 'Монгол утасны дугаар буруу (8 орон, 6-9-өөр эхэлнэ).' });
    }
    if (!password || String(password).trim().length < 4) {
      return res.status(400).json({ message: 'Нууц үг хамгийн багадаа 4 тэмдэгт байна.' });
    }
    const digits = normalizePhone(phone);
    const usernameTaken = await Member.findOne({ where: { username: digits } });
    if (usernameTaken) return res.status(400).json({ message: 'Энэ утасны дугаар бүртгэлтэй.' });
    const phoneTaken = await findMemberByPhone(digits);
    if (phoneTaken) return res.status(409).json({ message: 'Энэ утас өөр бүртгэлд холбогдсон байна.' });

    const session = await createVerifyMnSession(digits);
    rememberVerifySession(session.sessionId, {
      phone: digits,
      username: digits,
      firstName: names.firstName,
      lastName: names.lastName,
      name: names.name,
      passwordHash: await bcrypt.hash(String(password).trim(), 10),
    });

    const displayInstruction =
      session.displayInstruction ||
      `Та өөрийн ${digits} дугаараас 144773 дугаарт "${session.text}" гэж SMS илгээнэ үү. 2 SIM-тэй бол зөв SIM-ээ сонгоно уу.`;

    return res.json({
      sessionId: session.sessionId,
      phone: session.phone,
      shortcode: session.shortcode,
      text: session.text,
      smsUri: session.smsUri,
      displayInstruction,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    return sendAuthError(res, err);
  }
});

router.get('/member/verify/:sessionId', async (req, res) => {
  try {
    const sessionId = String(req.params.sessionId || '');
    const local = getRememberedSession(sessionId);
    if (!local) {
      return res.status(404).json({ message: 'SESSION олдсонгүй' });
    }
    if (local.consumed) {
      return res.status(409).json({ message: 'Энэ баталгаажуулалт аль хэдийн ашиглагдсан.' });
    }

    const remote = await getVerifyMnSession(sessionId);
    const sessionStatus = remote.sessionStatus || 'PENDING';
    if (sessionStatus !== 'VERIFIED') {
      return res.json({
        sessionId,
        sessionStatus,
        expiresAt: remote.expiresAt || null,
      });
    }

    if (local.creating) {
      return res.json({ sessionId, sessionStatus: 'PENDING', expiresAt: remote.expiresAt || null });
    }
    local.creating = true;
    try {
      const member = await createVerifiedMember(local);
      consumeVerifySession(sessionId);
      return res.json({
        sessionId,
        sessionStatus: 'VERIFIED',
        verifiedAt: remote.verifiedAt || null,
        token: signToken({ id: member.id, role: 'member' }),
        member: serializeMember(member, req),
      });
    } catch (err) {
      local.creating = false;
      throw err;
    }
  } catch (err) {
    return sendAuthError(res, err);
  }
});

async function findParentByPhone(phone) {
  const digits = normalizePhone(phone);
  if (!digits) return null;
  const parents = await Parent.findAll();
  return parents.find((parent) => normalizePhone(parent.phone) === digits) || null;
}

async function ensureParentForMember(member) {
  const digits = normalizePhone(member.phone);
  if (!digits) {
    const err = new Error('Утасны дугаар бүртгэлгүй тул эцэг эхийн горимд шилжих боломжгүй.');
    err.statusCode = 400;
    throw err;
  }
  let parent = await findParentByPhone(digits);
  if (!parent) {
    parent = await Parent.create({
      name: member.name,
      phone: digits,
      email: member.email || null,
      avatarUrl: member.avatarUrl || null,
      pinHash: member.pinHash,
      passwordHash: member.passwordHash || member.pinHash,
    });
  }
  return parent;
}

router.post('/switch-mode', async (req, res) => {
  try {
    const payload = readToken(req);
    if (!payload || !['member', 'parent'].includes(payload.role)) {
      return res.status(401).json({ message: 'Нэвтэрнэ үү.' });
    }
    const mode = String(req.body.mode || '').trim().toLowerCase();
    if (mode !== 'member' && mode !== 'parent') {
      return res.status(400).json({ message: 'Горим буруу байна.' });
    }

    if (mode === 'parent') {
      let member = null;
      if (payload.role === 'member') {
        member = await Member.findByPk(payload.id);
      } else {
        const current = await Parent.findByPk(payload.id);
        if (!current) return res.status(401).json({ message: 'Эцэг эх олдсонгүй.' });
        member = await findMemberByLogin(current.phone, memberAuthInclude);
      }
      if (!member) {
        const current = payload.role === 'parent' ? await Parent.findByPk(payload.id) : null;
        if (current) {
          return res.json({
            role: 'parent',
            token: signToken({ id: current.id, role: 'parent' }),
            parent: serializeParent(current),
          });
        }
        return res.status(400).json({ message: 'Эцэг эхийн горимд шилжих боломжгүй.' });
      }
      const parent = await ensureParentForMember(member);
      return res.json({
        role: 'parent',
        token: signToken({ id: parent.id, role: 'parent' }),
        parent: serializeParent(parent),
      });
    }

    let phone = '';
    if (payload.role === 'parent') {
      const parent = await Parent.findByPk(payload.id);
      if (!parent) return res.status(401).json({ message: 'Эцэг эх олдсонгүй.' });
      phone = parent.phone;
    } else {
      const member = await Member.findByPk(payload.id, { include: memberAuthInclude });
      if (!member) return res.status(401).json({ message: 'Гишүүн олдсонгүй.' });
      return res.json({
        role: 'member',
        token: signToken({ id: member.id, role: 'member' }),
        member: serializeMember(member, req),
      });
    }

    const member = await findMemberByLogin(phone, memberAuthInclude);
    if (!member) {
      return res.status(400).json({ message: 'Гишүүний бүртгэл олдсонгүй. Эхлээд гишүүнээр бүртгүүлнэ үү.' });
    }
    const type = member.MemberType;
    if (member.status !== 'active' || (type && type.hasAppAccess === false)) {
      return res.status(401).json({ message: 'Гишүүн идэвхгүй байна.' });
    }
    return res.json({
      role: 'member',
      token: signToken({ id: member.id, role: 'member' }),
      member: serializeMember(member, req),
    });
  } catch (err) {
    return sendAuthError(res, err);
  }
});

module.exports = router;
