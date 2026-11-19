const { Setting } = require('../models');
const { publicUrl } = require('../utils/helpers');

const DEFAULT_BRANDING = {
  logoUrl: '',
  tagline: 'Хийн буудлага · AA',
  name: 'PRIME',
  subtitle: '2019 оноос · Клуб',
};

function normalizeBranding(value = {}) {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    logoUrl: String(raw.logoUrl || '').trim(),
    tagline: String(raw.tagline ?? DEFAULT_BRANDING.tagline).trim() || DEFAULT_BRANDING.tagline,
    name: String(raw.name ?? DEFAULT_BRANDING.name).trim() || DEFAULT_BRANDING.name,
    subtitle: String(raw.subtitle ?? DEFAULT_BRANDING.subtitle).trim() || DEFAULT_BRANDING.subtitle,
  };
}

function serializeBranding(value, req) {
  const branding = normalizeBranding(value);
  return {
    ...branding,
    logoUrl: branding.logoUrl ? publicUrl(req, branding.logoUrl) || branding.logoUrl : '',
  };
}

async function loadBranding(req) {
  const row = await Setting.findByPk('branding');
  return serializeBranding(row?.value, req);
}

module.exports = { DEFAULT_BRANDING, normalizeBranding, serializeBranding, loadBranding };
