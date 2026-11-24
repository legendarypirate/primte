const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { Op } = require('sequelize');
const { Parent, Member, MemberType, Payment } = require('../models');

function normalizePhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const local = digits.replace(/^976/, '');
  return local.length >= 8 ? local.slice(-8) : (local || String(phone || '').trim());
}

function phoneCandidates(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return [];
  const digits = normalized.replace(/\D/g, '').replace(/^976/, '');
  const last8 = digits.length >= 8 ? digits.slice(-8) : digits;
  return [...new Set([normalized, digits, last8, `+976${digits}`, `976${digits}`, `+976${last8}`, `976${last8}`].filter(Boolean))];
}

async function findParentByPhone(phone, excludeId) {
  const candidates = phoneCandidates(phone);
  if (!candidates.length) return null;
  return Parent.findOne({
    where: {
      phone: { [Op.in]: candidates },
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
  });
}

async function ensureMemberAsParent(member) {
  const phone = normalizePhone(member.phone);
  if (!phone) {
    const error = new Error('Эцэг эхийн горимд утас шаардлагатай.');
    error.status = 400;
    throw error;
  }

  let parent = await Parent.findOne({ where: { memberId: member.id } });
  if (!parent) {
    const byPhone = await findParentByPhone(phone);
    if (byPhone) {
      if (byPhone.memberId && byPhone.memberId !== member.id) {
        const error = new Error('Энэ утас өөр эцэг эхэд бүртгэлтэй.');
        error.status = 400;
        throw error;
      }
      parent = byPhone;
      parent.memberId = member.id;
    }
  }

  const secretHash = member.passwordHash || member.pinHash || (await bcrypt.hash(randomUUID(), 10));
  if (parent) {
    parent.name = member.name;
    parent.phone = phone;
    parent.email = member.email || parent.email || null;
    parent.avatarUrl = member.avatarUrl || parent.avatarUrl || null;
    if (!parent.passwordHash && !parent.pinHash) {
      parent.pinHash = secretHash;
      parent.passwordHash = member.passwordHash || parent.passwordHash;
    }
    await parent.save();
    return parent;
  }

  return Parent.create({
    name: member.name,
    phone,
    email: member.email || null,
    avatarUrl: member.avatarUrl || null,
    memberId: member.id,
    pinHash: secretHash,
    passwordHash: member.passwordHash || secretHash,
  });
}

async function disableMemberAsParent(member) {
  const parent = await Parent.findOne({ where: { memberId: member.id } });
  if (!parent) return null;
  const kids = await Member.count({ where: { parentAccountId: parent.id } });
  if (kids) {
    const error = new Error('Хүүхэд холбоотой тул эцэг эхийн горимыг унтрааж болохгүй.');
    error.status = 400;
    throw error;
  }
  await Payment.destroy({ where: { parentId: parent.id } });
  await parent.destroy();
  return true;
}

async function applyMemberParentMode(member, parentMode) {
  if (parentMode === true) return ensureMemberAsParent(member);
  if (parentMode === false) return disableMemberAsParent(member);
  return null;
}

async function attachChildren(parent, memberIds) {
  const ids = [...new Set((memberIds || []).map(String).filter(Boolean))];
  if (!ids.length) {
    const error = new Error('Гишүүн сонгоно уу.');
    error.status = 400;
    throw error;
  }
  const members = await Member.findAll({
    where: { id: { [Op.in]: ids } },
    include: [MemberType],
  });
  for (const child of members) {
    if (child.id === parent.memberId) {
      const error = new Error('Эцэг эх өөрийгөө хүүхэд болгож болохгүй.');
      error.status = 400;
      throw error;
    }
    await child.update({
      parentAccountId: parent.id,
      parentId: null,
      parentName: parent.name,
      parentPhone: parent.phone,
      parentEmail: parent.email,
    });
  }
  return members;
}

async function detachChild(parent, childId) {
  const child = await Member.findOne({ where: { id: childId, parentAccountId: parent.id } });
  if (!child) {
    const error = new Error('Хүүхэд олдсонгүй.');
    error.status = 404;
    throw error;
  }
  await child.update({
    parentAccountId: null,
    parentName: null,
    parentPhone: null,
    parentEmail: null,
  });
  return child;
}

module.exports = {
  normalizePhone,
  ensureMemberAsParent,
  disableMemberAsParent,
  applyMemberParentMode,
  attachChildren,
  detachChild,
};
