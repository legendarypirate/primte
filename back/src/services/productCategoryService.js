const { Product, ProductCategory } = require('../models');

const DEFAULT_CATEGORIES = [
  { slug: 'bb', name: 'BB' },
  { slug: 'gas', name: 'Хий' },
  { slug: 'clothing', name: 'Хувцас' },
  { slug: 'accessory', name: 'Аксессуар' },
];

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

module.exports = { slugify, uniqueSlug, ensureProductCategories };
