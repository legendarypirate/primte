const assert = require('assert');
const {
  ADMIN_PERMISSIONS,
  MEMBER_PERMISSIONS,
  JUDGE_PERMISSIONS,
  ROLE_PRESETS,
  SYSTEM_ROLES,
  memberRoleSlug,
  judgeRoleSlug,
  matchPermissionForCompetition,
  scoreEnterPermission,
} = require('./catalog');

function unique(list, key) {
  const seen = new Set();
  for (const item of list) {
    assert.equal(seen.has(item[key]), false, `duplicate ${key}: ${item[key]}`);
    seen.add(item[key]);
  }
}

unique(ADMIN_PERMISSIONS, 'key');
unique(MEMBER_PERMISSIONS, 'key');
unique(JUDGE_PERMISSIONS, 'key');
assert.equal(SYSTEM_ROLES.filter((r) => r.kind === 'admin').length, 4);
assert.equal(SYSTEM_ROLES.filter((r) => r.kind === 'member').length, 4);
assert.equal(SYSTEM_ROLES.filter((r) => r.kind === 'judge').length, 4);
assert.ok(ROLE_PRESETS['student-member'].includes('app.match.level1'));
assert.equal(ROLE_PRESETS['student-member'].includes('app.match.level2'), false);
assert.ok(ROLE_PRESETS['level-2-member'].includes('app.match.level2'));
assert.ok(ROLE_PRESETS['level-3-member'].includes('app.match.level3'));
assert.equal(ROLE_PRESETS['level-i-ro'].includes('score.scores.enter.training'), false);
assert.ok(ROLE_PRESETS['level-ii-ro'].includes('score.scores.enter.training'));
assert.ok(ROLE_PRESETS.nroi.includes('score.scores.enter.club_l2'));

assert.equal(memberRoleSlug({ level: 0 }), 'student-member');
assert.equal(memberRoleSlug({ level: 2, MemberType: { category: 'official', level: 2 } }), 'level-2-member');
assert.equal(memberRoleSlug({ MemberType: { category: 'junior', level: 1 } }), 'student-member');
assert.equal(judgeRoleSlug({ certificationLevel: 'LEVEL_II_RO' }), 'level-ii-ro');
assert.equal(judgeRoleSlug({ certificationLevel: 'NROI' }), 'nroi');
assert.equal(matchPermissionForCompetition({ level: 'Level 2', title: 'УАШТ' }), 'app.match.level2');
assert.equal(matchPermissionForCompetition({ title: 'Өвлийн бэлтгэл' }), 'app.match.practice');
assert.equal(scoreEnterPermission('TRAINING'), 'score.scores.enter.training');
assert.equal(scoreEnterPermission('MPBH'), 'score.scores.enter.club_l2');

console.log('rbac catalog ok');
