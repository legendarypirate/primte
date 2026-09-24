const jwt = require('jsonwebtoken');
const { Admin, Member, Parent, Role, MemberType, DevelopmentActivity } = require('../models');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d',
  });
}

function readToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

function serializeAdmin(admin) {
  const role = admin.Role;
  const permissions = role?.isSuper ? ['*'] : role?.permissions || [];
  return {
    id: admin.id,
    name: admin.name,
    username: admin.username || null,
    email: admin.email,
    roleId: admin.roleId,
    role: role
      ? { id: role.id, name: role.name, slug: role.slug, isSuper: role.isSuper }
      : null,
    permissions,
  };
}

function hasPermission(admin, key) {
  const role = admin?.Role;
  if (!role) return false;
  if (role.isSuper) return true;
  const perms = role.permissions || [];
  return perms.includes('*') || perms.includes(key);
}

async function requireAdmin(req, res, next) {
  const payload = readToken(req);
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ message: 'Админ эрх шаардлагатай.' });
  }
  const admin = await Admin.findByPk(payload.id, { include: [Role] });
  if (!admin) return res.status(401).json({ message: 'Админ олдсонгүй.' });
  req.admin = admin;
  req.adminRole = admin.Role;
  return next();
}

function requirePermission(key) {
  return (req, res, next) => {
    if (hasPermission(req.admin, key)) return next();
    return res.status(403).json({ message: 'Энэ үйлдэл хийх эрхгүй.' });
  };
}

function serializeParent(parent) {
  return {
    id: parent.id,
    name: parent.name,
    phone: parent.phone,
    email: parent.email,
    avatarUrl: parent.avatarUrl,
  };
}

async function requireParent(req, res, next) {
  const payload = readToken(req);
  if (!payload || payload.role !== 'parent') {
    return res.status(401).json({ message: 'Эцэг эхийн эрх шаардлагатай.' });
  }
  const parent = await Parent.findByPk(payload.id);
  if (!parent) return res.status(401).json({ message: 'Эцэг эх олдсонгүй.' });
  req.parent = parent;
  return next();
}

async function requireMember(req, res, next) {
  const payload = readToken(req);
  if (!payload || payload.role !== 'member') {
    return res.status(401).json({ message: 'Нэвтэрнэ үү.' });
  }
  const member = await Member.findByPk(payload.id, {
    include: [MemberType, DevelopmentActivity, { model: Member, as: 'parent' }],
  });
  if (!member) return res.status(401).json({ message: 'Гишүүн олдсонгүй.' });
  const type = member.MemberType;
  const blocked = member.status !== 'active' || (type && type.hasAppAccess === false);
  if (blocked) return res.status(401).json({ message: 'Гишүүн идэвхгүй байна.' });
  req.member = member;
  return next();
}

module.exports = {
  signToken,
  requireAdmin,
  requireMember,
  requireParent,
  requirePermission,
  serializeAdmin,
  serializeParent,
  hasPermission,
};
