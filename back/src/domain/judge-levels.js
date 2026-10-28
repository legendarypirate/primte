const CERT_LEVELS = ['LEVEL_I_RO', 'LEVEL_II_RO', 'LEVEL_III_RO', 'NROI'];
const TIERS = ['TRAINING', 'CLUB_L1', 'CLUB_L2', 'MPBH'];
const POSITIONS = ['ARO', 'RO', 'CRO', 'RM', 'SO'];

function normalize(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, '_');
}

function parseCertLevel(raw) {
  const s = normalize(raw);
  if (s.includes('NROI')) return 'NROI';
  if (s.includes('III') || s === '3' || s === 'L3' || s.includes('LEVEL_3')) return 'LEVEL_III_RO';
  if (s.includes('II') || s === '2' || s === 'L2' || s.includes('LEVEL_2')) return 'LEVEL_II_RO';
  return 'LEVEL_I_RO';
}

function competitionHaystack(competition = {}, extra = []) {
  return [
    competition.title,
    competition.subtitle,
    competition.level,
    competition.organizer,
    competition.MatchType?.name,
    competition.MatchType?.comment,
    ...(Array.isArray(competition.tags) ? competition.tags : []),
    ...extra,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function inferCompetitionTier(competition = {}, extra = []) {
  const hay = competitionHaystack(competition, extra);
  if (/бэлтгэл|training|practice|classifier/.test(hay)) return 'TRAINING';
  if (/мпбх|mpbh|level\s*(3|4|5|iii|iv|v)\b|3-р\s*түвш/.test(hay)) return 'MPBH';
  if (/level\s*(2|ii)\b|2-р\s*түвш|2р\s*түвш|club\s*l?2/.test(hay)) return 'CLUB_L2';
  if (/level\s*(1|i)\b|1-р\s*түвш|1р\s*түвш|club\s*l?1/.test(hay)) return 'CLUB_L1';
  return 'CLUB_L1';
}

function parseCompetitionTier(raw, competition, extra) {
  const direct = normalize(raw);
  if (direct.includes('TRAINING') || direct.includes('PRACTICE') || direct.includes('БЭЛТГЭЛ')) return 'TRAINING';
  if (
    direct === 'MPBH' ||
    direct.includes('МПБХ') ||
    direct.includes('LEVEL_III') ||
    direct.includes('LEVEL_3') ||
    direct.includes('LEVEL_IV') ||
    direct.includes('LEVEL_V')
  ) {
    return 'MPBH';
  }
  if (direct === 'CLUB_L2' || direct === 'LEVEL_II' || direct === 'LEVEL_2' || direct.includes('CLUB_L2')) {
    return 'CLUB_L2';
  }
  if (direct === 'CLUB_L1' || direct === 'LEVEL_I' || direct === 'LEVEL_1' || direct.includes('CLUB_L1')) {
    return 'CLUB_L1';
  }
  return inferCompetitionTier(competition, extra);
}

function resolveCompetitionTier(competition = {}, extra = []) {
  return parseCompetitionTier(competition.level, competition, extra);
}

function grant(position, access, note = '') {
  return { position, access, note };
}

function grantsFor(level, tier) {
  const cert = parseCertLevel(level);
  const t = TIERS.includes(tier) ? tier : parseCompetitionTier(tier);

  if (t === 'TRAINING') {
    if (cert === 'LEVEL_I_RO') return [grant('ARO', 'allowed')];
    if (cert === 'LEVEL_II_RO') return [grant('RO', 'allowed')];
    return [];
  }

  if (t === 'CLUB_L1') {
    if (cert === 'LEVEL_II_RO') {
      return [grant('ARO', 'allowed'), grant('RO', 'rmApproval', 'RM зөвшөөрсөн тохиолдолд')];
    }
    if (cert === 'LEVEL_III_RO') {
      return [
        grant('RO', 'allowed'),
        grant('CRO', 'mdAppointment', 'MD томилгоогоор'),
        grant('RM', 'mdAppointment', 'MD томилгоогоор'),
      ];
    }
    if (cert === 'NROI') return [grant('RO', 'allowed')];
    return [];
  }

  if (cert === 'LEVEL_II_RO') return [grant('ARO', 'rmApproval', 'RM зөвшөөрсөн тохиолдолд')];
  if (cert === 'LEVEL_III_RO') {
    return [grant('ARO', 'allowed'), grant('RO', 'rmApproval', 'RM зөвшөөрсөн тохиолдолд')];
  }
  if (cert === 'NROI') return [grant('RO', 'allowed')];
  return [];
}

function grantAllows(item, { rmApproved = false, mdAppointed = false } = {}) {
  if (item.access === 'allowed') return true;
  if (item.access === 'rmApproval') return Boolean(rmApproved);
  if (item.access === 'mdAppointment') return Boolean(mdAppointed);
  return false;
}

function formatGrants(items) {
  if (!items.length) return '—';
  return items
    .map((item) => {
      if (item.access === 'rmApproval') return `${item.position} (RM зөвшөөрсөн тохиолдолд)`;
      if (item.access === 'mdAppointment') return `${item.position} (MD томилгоогоор)`;
      return item.position;
    })
    .join(', ');
}

function canWorkPosition(level, tier, position, opts = {}) {
  return grantsFor(level, tier).some((item) => item.position === position && grantAllows(item, opts));
}

function canEnterScores(level, tier, staffRole, opts = {}) {
  const role = String(staffRole || '')
    .trim()
    .toUpperCase();
  if (role === 'SCOREKEEPER' || role === 'RANGE_MASTER' || role === 'MATCH_DIRECTOR') return true;
  return canWorkPosition(level, tier, 'RO', opts);
}

function toHours(n) {
  const v = Number(n);
  return Number.isFinite(v) ? Math.max(0, v) : 0;
}

function nextTrainingProgress(level, hours = {}) {
  const cert = parseCertLevel(level);
  const trainingAro = toHours(hours.trainingAro);
  const trainingRo = toHours(hours.trainingRo);
  const clubL1Aro = toHours(hours.clubL1Aro);
  if (cert === 'LEVEL_I_RO') {
    return {
      eligible: trainingAro >= 45,
      ratio: Math.min(1, trainingAro / 45),
      detail: `Бэлтгэл тэмцээнд ${trainingAro}/45 цаг талбайн туслах шүүгч (ARO) хийсэн.`,
    };
  }
  if (cert === 'LEVEL_II_RO') {
    const trainingPath = trainingAro >= 60 && trainingRo >= 30;
    const clubPath = clubL1Aro >= 30;
    return {
      eligible: trainingPath || clubPath,
      ratio: Math.max(Math.min(1, (Math.min(1, trainingAro / 60) + Math.min(1, trainingRo / 30)) / 2), Math.min(1, clubL1Aro / 30)),
      detail: trainingPath
        ? 'Бэлтгэл тэмцээний 60 цаг ARO + 30 цаг RO хангагдсан.'
        : clubPath
          ? '1-р түвшний тэмцээнд 30 цаг ARO хангагдсан.'
          : `Бэлтгэл: ${trainingAro}/60 цаг ARO, ${trainingRo}/30 цаг RO · эсвэл L1 тэмцээн ${clubL1Aro}/30 цаг ARO.`,
    };
  }
  if (cert === 'LEVEL_III_RO') {
    return {
      eligible: true,
      ratio: 1,
      detail: 'RO, CRO, RM, SO сургалтуудад нэмэлтээр хамрагдаж статусыг нэмэгдүүлэх боломжтой.',
    };
  }
  return {
    eligible: false,
    ratio: 1,
    detail: 'Клубийн шүүгчийн журмын 5.4-г харна уу.',
  };
}

function meetsAnnualQuota(level, hours = {}) {
  if (parseCertLevel(level) !== 'LEVEL_III_RO') return true;
  return toHours(hours.annualYtd) >= 60;
}

function serializeJudgeLevel(judge = {}) {
  const certificationLevel = parseCertLevel(judge.certificationLevel);
  const hours = {
    trainingAro: toHours(judge.trainingAroHours),
    trainingRo: toHours(judge.trainingRoHours),
    clubL1Aro: toHours(judge.clubL1AroHours),
    annualYtd: toHours(judge.annualHoursYtd),
  };
  return {
    certificationLevel,
    trainingAroHours: hours.trainingAro,
    trainingRoHours: hours.trainingRo,
    clubL1AroHours: hours.clubL1Aro,
    annualHoursYtd: hours.annualYtd,
    nextTraining: nextTrainingProgress(certificationLevel, hours),
    annualQuotaMet: meetsAnnualQuota(certificationLevel, hours),
  };
}

module.exports = {
  CERT_LEVELS,
  TIERS,
  POSITIONS,
  parseCertLevel,
  parseCompetitionTier,
  inferCompetitionTier,
  resolveCompetitionTier,
  grantsFor,
  formatGrants,
  canWorkPosition,
  canEnterScores,
  nextTrainingProgress,
  meetsAnnualQuota,
  serializeJudgeLevel,
};
