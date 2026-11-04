const { Role } = require('../models');
const sequelize = require('../config/database');
const {
  ROLE_PRESETS,
  SYSTEM_ROLES,
  memberRoleSlug,
  judgeRoleSlug,
  scoreEnterPermission,
} = require('../rbac/catalog');

const cache = {
  bySlug: new Map(),
};

function listFrom(value) {
  return Array.isArray(value) ? value : [];
}

function hasKey(permissions, key) {
  const perms = listFrom(permissions);
  return perms.includes('*') || perms.includes(key);
}

async function ensureKindColumn() {
  try {
    await sequelize.query('ALTER TABLE roles ALTER COLUMN kind TYPE VARCHAR(32) USING kind::text');
  } catch {
    // already varchar, or table not created yet
  }
}

async function refreshCache() {
  const roles = await Role.findAll();
  cache.bySlug = new Map(roles.map((role) => [role.slug, role]));
  return roles;
}

async function ensureSystemRoles() {
  await ensureKindColumn();
  const existing = await Role.findAll();
  const bySlug = new Map(existing.map((role) => [role.slug, role]));

  for (const spec of SYSTEM_ROLES) {
    const permissions = ROLE_PRESETS[spec.slug] || [];
    const current = bySlug.get(spec.slug);
    if (!current) {
      const created = await Role.create({ ...spec, permissions });
      bySlug.set(spec.slug, created);
      continue;
    }
    const next = listFrom(current.permissions);
    const missing = permissions.filter((key) => !next.includes(key));
    const patch = {
      name: spec.name,
      description: spec.description,
      kind: spec.kind,
      isSystem: true,
      sortOrder: spec.sortOrder,
    };
    if (spec.isSuper) patch.isSuper = true;
    if (missing.length) patch.permissions = [...next, ...missing];
    await current.update(patch);
  }

  return refreshCache();
}

function roleBySlug(slug) {
  return cache.bySlug.get(slug) || null;
}

function permissionsForSlug(slug) {
  const role = roleBySlug(slug);
  if (role?.isSuper) return ['*'];
  if (role) return listFrom(role.permissions);
  return ROLE_PRESETS[slug] || [];
}

function permissionsForMember(member) {
  return permissionsForSlug(memberRoleSlug(member));
}

function permissionsForJudge(judge) {
  return permissionsForSlug(judgeRoleSlug(judge));
}

function memberHasPermission(member, key) {
  return hasKey(permissionsForMember(member), key);
}

function judgeHasPermission(judge, key) {
  return hasKey(permissionsForJudge(judge), key);
}

function judgeCanEnterScores(judge, tier, domainAllows) {
  const role = String(judge?.role || '').trim().toUpperCase();
  if (role === 'SCOREKEEPER' || role === 'RANGE_MASTER' || role === 'MATCH_DIRECTOR') {
    return true;
  }
  if (!judgeHasPermission(judge, scoreEnterPermission(tier))) return false;
  return domainAllows !== false;
}

module.exports = {
  ensureSystemRoles,
  refreshCache,
  roleBySlug,
  permissionsForSlug,
  permissionsForMember,
  permissionsForJudge,
  memberHasPermission,
  judgeHasPermission,
  judgeCanEnterScores,
};
