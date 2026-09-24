const express = require('express');
const { SitePage, SiteLayout } = require('../models');
const { DEFAULT_LAYOUT } = require('../site/layout-defaults');

const router = express.Router();

function serializePage(page) {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    blocks: page.blocks || [],
    updatedAt: page.updatedAt,
  };
}

router.get('/pages', async (_req, res) => {
  const pages = await SitePage.findAll({
    where: { published: true },
    attributes: ['slug', 'title', 'metaTitle', 'updatedAt'],
    order: [['sortOrder', 'ASC'], ['title', 'ASC']],
  });
  res.json({ pages });
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

router.get('/layout', async (_req, res) => {
  const layout = await getOrCreateLayout();
  res.json({
    layout: {
      header: layout.header || DEFAULT_LAYOUT.header,
      footer: layout.footer || DEFAULT_LAYOUT.footer,
      updatedAt: layout.updatedAt,
    },
  });
});

router.get('/pages/:slug', async (req, res) => {
  const page = await SitePage.findOne({
    where: { slug: req.params.slug, published: true },
  });
  if (!page) return res.status(404).json({ message: 'Хуудас олдсонгүй' });
  res.json({ page: serializePage(page) });
});

module.exports = router;
