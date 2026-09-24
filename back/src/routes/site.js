const express = require('express');
const { SitePage } = require('../models');

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

router.get('/pages/:slug', async (req, res) => {
  const page = await SitePage.findOne({
    where: { slug: req.params.slug, published: true },
  });
  if (!page) return res.status(404).json({ message: 'Хуудас олдсонгүй' });
  res.json({ page: serializePage(page) });
});

module.exports = router;
