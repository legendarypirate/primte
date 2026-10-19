const { toInt, toDelta, addExperience } = require('./membership');

const XP_AWARDS = {
  trainingHour: {
    xp: 1,
    source: 'training_hour',
    title: '1 цаг бэлтгэл',
    body: '1 цаг бэлтгэл хийх +1 XP',
  },
  trainingMatch: {
    xp: 5,
    source: 'training_match',
    title: 'Бэлтгэл тэмцээн',
    body: 'Бэлтгэл тэмцээнд оролцох +5 XP',
  },
  competition: {
    xp: 10,
    source: 'competition',
    title: 'Тэмцээн',
    body: 'Тэмцээнд оролцох +10 XP',
  },
};

const POINT_RULES = {
  xp: [
    XP_AWARDS.trainingHour,
    XP_AWARDS.trainingMatch,
    XP_AWARDS.competition,
  ],
  rp: {
    title: 'Rating Point',
    body: 'Клубийн гишүүдийн чансаа тодорхойлох журмын дагуу гишүүнд бүртгэлтэй оноог ойлгоно.',
  },
};

function applyPointDelta(current = {}, delta = {}) {
  const xpDelta = Math.max(0, toDelta(delta.xp));
  const rpDelta = toDelta(delta.rp);
  const next = addExperience(current, { xp: xpDelta, rp: rpDelta });
  return {
    ...next,
    xpDelta,
    rpDelta,
  };
}

function clampAbsoluteScores(current = {}, requested = {}) {
  const currentXp = toInt(current.xp);
  const currentRp = toInt(current.rp);
  const xp = requested.xp !== undefined ? Math.max(currentXp, toInt(requested.xp)) : currentXp;
  const rp = requested.rp !== undefined ? toInt(requested.rp) : currentRp;
  return {
    xp,
    rp,
    xpDelta: xp - currentXp,
    rpDelta: rp - currentRp,
  };
}

function isTrainingMatch(competition = {}) {
  const hay = [
    competition.title,
    competition.subtitle,
    competition.level,
    competition.MatchType?.name,
    competition.MatchType?.comment,
    ...(Array.isArray(competition.tags) ? competition.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return /бэлтгэл|training|practice|classifier/.test(hay);
}

function competitionXpAward(competition) {
  return isTrainingMatch(competition) ? XP_AWARDS.trainingMatch : XP_AWARDS.competition;
}

module.exports = {
  XP_AWARDS,
  POINT_RULES,
  applyPointDelta,
  clampAbsoluteScores,
  isTrainingMatch,
  competitionXpAward,
};
