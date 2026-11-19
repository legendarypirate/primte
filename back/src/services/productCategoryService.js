const { Product, ProductCategory } = require('../models');
const { serializeProductCategory } = require('../utils/helpers');

const DEFAULT_CATEGORIES = [
  { slug: 'bb', name: 'BB' },
  { slug: 'gas', name: 'Хий' },
  { slug: 'clothing', name: 'Хувцас' },
  { slug: 'accessory', name: 'Аксессуар' },
];

const MAX_CATEGORY_DEPTH = 4;

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(base, excludeId) {
  const root = slugify(base) || 'category';
  let slug = root;
  let n = 2;
  for (;;) {
    const existing = await ProductCategory.findOne({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${root}-${n++}`;
  }
}

function parseParentId(value) {
  if (value == null || value === '' || value === 'null' || value === 'undefined') return null;
  return String(value);
}

function childrenMap(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.parentId || null;
    const list = map.get(key) || [];
    list.push(row);
    map.set(key, list);
  }
  for (const list of map.values()) {
    list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || String(a.name).localeCompare(String(b.name), 'mn'));
  }
  return map;
}

function flattenTree(rows) {
  const byParent = childrenMap(rows);
  const out = [];
  const seen = new Set();
  function walk(parentId) {
    for (const row of byParent.get(parentId) || []) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
      walk(row.id);
    }
  }
  walk(null);
  for (const row of rows) {
    if (!seen.has(row.id)) out.push(row);
  }
  return out;
}

function descendantIds(id, rows) {
  const byParent = childrenMap(rows);
  const out = new Set();
  const stack = [...(byParent.get(id) || [])];
  while (stack.length) {
    const cur = stack.pop();
    if (out.has(cur.id)) continue;
    out.add(cur.id);
    stack.push(...(byParent.get(cur.id) || []));
  }
  return out;
}

function subtreeHeight(id, rows) {
  const byParent = childrenMap(rows);
  function height(nodeId) {
    const kids = byParent.get(nodeId) || [];
    if (!kids.length) return 1;
    return 1 + Math.max(...kids.map((kid) => height(kid.id)));
  }
  return height(id);
}

function ancestorDepth(parentId, rows) {
  if (!parentId) return 0;
  const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
  let depth = 0;
  let cur = byId[parentId];
  const seen = new Set();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    depth += 1;
    cur = cur.parentId ? byId[cur.parentId] : null;
  }
  return depth;
}

async function assertValidParent(categoryId, parentId) {
  const resolved = parseParentId(parentId);
  if (!resolved) return null;
  if (categoryId && resolved === categoryId) {
    const err = new Error('Ангилал өөрийгөө эцэг болгож болохгүй.');
    err.statusCode = 400;
    throw err;
  }
  const rows = await ProductCategory.findAll({ attributes: ['id', 'parentId'] });
  const parent = rows.find((row) => row.id === resolved);
  if (!parent) {
    const err = new Error('Эцэг ангилал олдсонгүй.');
    err.statusCode = 400;
    throw err;
  }
  if (categoryId && descendantIds(categoryId, rows).has(resolved)) {
    const err = new Error('Дэд ангиллаа эцэг болгож болохгүй.');
    err.statusCode = 400;
    throw err;
  }
  const height = categoryId ? subtreeHeight(categoryId, rows) : 1;
  if (ancestorDepth(resolved, rows) + height > MAX_CATEGORY_DEPTH) {
    const err = new Error(`Ангилал хамгийн ихдээ ${MAX_CATEGORY_DEPTH} төвшинтэй байж болно.`);
    err.statusCode = 400;
    throw err;
  }
  return resolved;
}

function decorateCategories(categories, countMap = {}) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c]));
  const byParent = childrenMap(categories);

  function pathFor(category) {
    const names = [];
    const seen = new Set();
    let cur = category;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      names.unshift(cur.name);
      cur = cur.parentId ? byId[cur.parentId] : null;
    }
    return names.join(' / ');
  }

  function depthFor(category) {
    let depth = 0;
    const seen = new Set();
    let cur = category.parentId ? byId[category.parentId] : null;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      depth += 1;
      cur = cur.parentId ? byId[cur.parentId] : null;
    }
    return depth;
  }

  function totalCount(id) {
    const cat = byId[id];
    let n = countMap[cat.slug] || 0;
    for (const child of byParent.get(id) || []) n += totalCount(child.id);
    return n;
  }

  return flattenTree(categories).map((c) => {
    const productCount = countMap[c.slug] || 0;
    return serializeProductCategory(c, {
      parentName: c.parentId ? byId[c.parentId]?.name || null : null,
      path: pathFor(c),
      depth: depthFor(c),
      childCount: (byParent.get(c.id) || []).length,
      productCount,
      totalProductCount: totalCount(c.id),
    });
  });
}

function assertAcyclic(parentMap) {
  for (const id of parentMap.keys()) {
    const seen = new Set();
    let cur = parentMap.get(id);
    let depth = 0;
    while (cur) {
      if (cur === id || seen.has(cur)) {
        const err = new Error('Ангиллын мод буруу байна.');
        err.statusCode = 400;
        throw err;
      }
      seen.add(cur);
      depth += 1;
      if (depth >= MAX_CATEGORY_DEPTH) {
        const err = new Error(`Ангилал хамгийн ихдээ ${MAX_CATEGORY_DEPTH} төвшинтэй байж болно.`);
        err.statusCode = 400;
        throw err;
      }
      cur = parentMap.get(cur) || null;
    }
  }
}

async function applyCategoryOrder(items) {
  const rows = await ProductCategory.findAll();
  const known = new Set(rows.map((row) => row.id));
  const updates = [];
  for (const item of Array.isArray(items) ? items : []) {
    const id = String(item?.id || '');
    if (!known.has(id)) continue;
    updates.push({
      id,
      parentId: item.parentId === undefined ? undefined : parseParentId(item.parentId),
      sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
    });
  }
  if (!updates.length) {
    const err = new Error('Эрэмбэ хоосон байна.');
    err.statusCode = 400;
    throw err;
  }
  const parentMap = new Map(rows.map((row) => [row.id, row.parentId || null]));
  for (const update of updates) {
    if (update.parentId !== undefined) parentMap.set(update.id, update.parentId);
  }
  assertAcyclic(parentMap);
  const sequelize = ProductCategory.sequelize;
  await sequelize.transaction(async (t) => {
    for (const update of updates) {
      const patch = { sortOrder: update.sortOrder };
      if (update.parentId !== undefined) patch.parentId = update.parentId;
      await ProductCategory.update(patch, { where: { id: update.id }, transaction: t });
    }
  });
  return ProductCategory.findAll({ order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']] });
}

async function ensureProductCategories() {
  if ((await ProductCategory.count()) > 0) return;
  const used = await Product.findAll({ attributes: ['category'], group: ['category'], raw: true });
  const slugs = new Set(DEFAULT_CATEGORIES.map((c) => c.slug));
  const rows = [...DEFAULT_CATEGORIES];
  for (const { category } of used) {
    if (category && !slugs.has(category)) {
      slugs.add(category);
      rows.push({ slug: category, name: category });
    }
  }
  await ProductCategory.bulkCreate(rows.map((row, i) => ({ ...row, sortOrder: i + 1 })));
}

module.exports = {
  slugify,
  uniqueSlug,
  parseParentId,
  assertValidParent,
  decorateCategories,
  applyCategoryOrder,
  ensureProductCategories,
};
