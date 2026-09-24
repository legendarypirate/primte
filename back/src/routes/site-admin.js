const express = require('express');
const { SitePage } = require('../models');
const { requireAdmin, requirePermission } = require('../middleware/auth');
const { DEFAULT_PAGES } = require('../site/defaults');

const router = express.Router();
router.use(requireAdmin);

const PAGE_FIELDS = ['title', 'metaTitle', 'metaDescription', 'published', 'sortOrder', 'blocks'];

function pick(body, keys) {
  const out = {};
  for (const key of keys) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

function serializeAdminPage(page) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    published: page.published,
    sortOrder: page.sortOrder,
    blocks: page.blocks || [],
    blockCount: (page.blocks || []).length,
    updatedAt: page.updatedAt,
    createdAt: page.createdAt,
  };
}

function validateBlocks(blocks) {
  if (!Array.isArray(blocks)) return 'blocks must be an array';
  for (const block of blocks) {
    if (!block || typeof block !== 'object') return 'Invalid block';
    if (!block.id || !block.type) return 'Each block needs id and type';
    if (!block.data || typeof block.data !== 'object') return 'Each block needs data object';
  }
  return null;
}

async function seedDefaultPages() {
  const existing = await SitePage.count();
  if (existing > 0) return SitePage.findAll({ order: [['sortOrder', 'ASC']] });

  const rows = [];
  for (const page of DEFAULT_PAGES) {
    rows.push(
      await SitePage.create({
        slug: page.slug,
        title: page.title,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        sortOrder: page.sortOrder,
        published: true,
        blocks: page.blocks,
      })
    );
  }
  return rows;
}

router.get('/site-pages', requirePermission('site.view'), async (_req, res) => {
  let pages = await SitePage.findAll({ order: [['sortOrder', 'ASC'], ['title', 'ASC']] });
  if (!pages.length) pages = await seedDefaultPages();
  res.json({ pages: pages.map(serializeAdminPage) });
});

router.get('/site-pages/:id', requirePermission('site.view'), async (req, res) => {
  const page = await SitePage.findByPk(req.params.id);
  if (!page) return res.status(404).json({ message: 'Хуудас олдсонгүй' });
  res.json({ page: serializeAdminPage(page) });
});

router.put('/site-pages/:id', requirePermission('site.manage'), async (req, res) => {
  const page = await SitePage.findByPk(req.params.id);
  if (!page) return res.status(404).json({ message: 'Хуудас олдсонгүй' });

  const payload = pick(req.body, PAGE_FIELDS);
  if (payload.blocks !== undefined) {
    const err = validateBlocks(payload.blocks);
    if (err) return res.status(400).json({ message: err });
  }

  await page.update(payload);
  res.json({ page: serializeAdminPage(page) });
});

router.post('/site-pages/seed', requirePermission('site.manage'), async (_req, res) => {
  await SitePage.destroy({ where: {}, truncate: false });
  const pages = await seedDefaultPages();
  res.json({ ok: true, count: pages.length });
});

module.exports = router;
