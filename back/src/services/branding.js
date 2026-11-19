const { Setting } = require('../models');
const { publicUrl } = require('../utils/helpers');

const DEFAULT_BRANDING = {
  imageUrl: '',
};

function normalizeBranding(value = {}) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    imageUrl: String(raw.imageUrl || raw.logoUrl || '').trim(),
  };
}

function serializeBranding(value, req) {
  const branding = normalizeBranding(value);
  const imageUrl = branding.imageUrl ? publicUrl(req, branding.imageUrl) || branding.imageUrl : '';
  return { imageUrl, logoUrl: imageUrl };
}

async function loadBranding(req) {
  const row = await Setting.findByPk('branding');
  return serializeBranding(row?.value, req);
}

module.exports = { DEFAULT_BRANDING, normalizeBranding, serializeBranding, loadBranding };
