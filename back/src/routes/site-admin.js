const express = require('express');
const { SitePage, SiteLayout } = require('../models');
const { requireAdmin, requirePermission } = require('../middleware/auth');
const { DEFAULT_PAGES } = require('../site/defaults');
const { DEFAULT_LAYOUT } = require('../site/layout-defaults');

const router = express.Router();
router.use(requireAdmin);

const PAGE_FIELDS = ['title', 'metaTitle', 'metaDescription', 'published', 'sortOrder', 'blocks', 'content'];

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
    content: page.content || {},
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
  const existing = new Set((await SitePage.findAll({ attributes: ['slug'] })).map((p) => p.slug));
  for (const page of DEFAULT_PAGES) {
    if (existing.has(page.slug)) continue;
    await SitePage.create({
      slug: page.slug,
      title: page.title,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      sortOrder: page.sortOrder,
      published: true,
      blocks: page.blocks,
    });
  }
  return SitePage.findAll({ order: [['sortOrder', 'ASC'], ['title', 'ASC']] });
}

router.get('/site-pages', requirePermission('site.view'), async (_req, res) => {
  const pages = await seedDefaultPages();
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
  if (payload.content !== undefined) {
    if (!payload.content || typeof payload.content !== 'object' || Array.isArray(payload.content)) {
      return res.status(400).json({ message: 'content must be an object' });
    }
  }

  await page.update(payload);
  res.json({ page: serializeAdminPage(page) });
});

router.post('/site-pages/seed', requirePermission('site.manage'), async (_req, res) => {
  await SitePage.destroy({ where: {}, truncate: false });
  const pages = await seedDefaultPages();
  res.json({ ok: true, count: pages.length });
});

async function getOrCreateLayout() {
  let layout = await SiteLayout.findOne();
  if (!layout) {
    layout = await SiteLayout.create({
      header: DEFAULT_LAYOUT.header,
      footer: DEFAULT_LAYOUT.footer,
    });
  }
  return layout;
}

function serializeLayout(layout) {
  return {
    id: layout.id,
    header: layout.header || DEFAULT_LAYOUT.header,
    footer: layout.footer || DEFAULT_LAYOUT.footer,
    updatedAt: layout.updatedAt,
    createdAt: layout.createdAt,
  };
}

router.get('/site-layout', requirePermission('site.view'), async (_req, res) => {
  const layout = await getOrCreateLayout();
  res.json({ layout: serializeLayout(layout) });
});

router.put('/site-layout', requirePermission('site.manage'), async (req, res) => {
  const layout = await getOrCreateLayout();
  const payload = {};
  if (req.body.header !== undefined) {
    if (!req.body.header || typeof req.body.header !== 'object') {
      return res.status(400).json({ message: 'header must be an object' });
    }
    payload.header = req.body.header;
  }
  if (req.body.footer !== undefined) {
    if (!req.body.footer || typeof req.body.footer !== 'object') {
      return res.status(400).json({ message: 'footer must be an object' });
    }
    payload.footer = req.body.footer;
  }
  await layout.update(payload);
  res.json({ layout: serializeLayout(layout) });
});

router.post('/site-layout/reset', requirePermission('site.manage'), async (_req, res) => {
  const layout = await getOrCreateLayout();
  await layout.update({
    header: DEFAULT_LAYOUT.header,
    footer: DEFAULT_LAYOUT.footer,
  });
  res.json({ layout: serializeLayout(layout) });
});

module.exports = router;
