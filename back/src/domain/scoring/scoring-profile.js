const IPSC_HANDGUN = {
  id: 'IPSC_HANDGUN',
  name: 'IPSC Handgun',
  powerFactorEnabled: true,
  major: { A: 5, C: 4, D: 2 },
  minor: { A: 5, C: 3, D: 1 },
  missPenalty: 10,
  noShootPenalty: 10,
  proceduralPenalty: 10,
  minimumStagePoints: 0,
  hitFactorDisplayPrecision: 4,
  stagePointsDisplayPrecision: 4,
  percentageDisplayPrecision: 2,
};

const IPSC_ACTION_AIR = {
  id: 'IPSC_ACTION_AIR',
  name: 'IPSC Action Air',
  powerFactorEnabled: false,
  major: { A: 5, C: 3, D: 1 },
  minor: { A: 5, C: 3, D: 1 },
  missPenalty: 10,
  noShootPenalty: 10,
  proceduralPenalty: 10,
  minimumStagePoints: 0,
  hitFactorDisplayPrecision: 4,
  stagePointsDisplayPrecision: 4,
  percentageDisplayPrecision: 2,
};

const PROFILES = {
  IPSC_HANDGUN,
  IPSC_ACTION_AIR,
};

function getScoringProfile(id) {
  return PROFILES[id] || null;
}

module.exports = {
  IPSC_HANDGUN,
  IPSC_ACTION_AIR,
  PROFILES,
  getScoringProfile,
};
