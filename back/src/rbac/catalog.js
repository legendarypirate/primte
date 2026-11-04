const ADMIN_PERMISSIONS = [
  { key: 'dashboard.view', group: 'Хянах самбар', label: 'Хянах самбар харах' },
  { key: 'members.view', group: 'Гишүүд', label: 'Гишүүдийн жагсаалт харах' },
  { key: 'members.create', group: 'Гишүүд', label: 'Гишүүн бүртгэх' },
  { key: 'members.update', group: 'Гишүүд', label: 'Гишүүн засах' },
  { key: 'members.delete', group: 'Гишүүд', label: 'Гишүүн устгах' },
  { key: 'members.topup', group: 'Гишүүд', label: 'Хэтэвч цэнэглэх' },
  { key: 'parents.view', group: 'Эцэг эх', label: 'Эцэг эх харах' },
  { key: 'parents.manage', group: 'Эцэг эх', label: 'Эцэг эх удирдах' },
  { key: 'judges.view', group: 'Шүүгчид', label: 'Шүүгч харах' },
  { key: 'judges.manage', group: 'Шүүгчид', label: 'Шүүгч удирдах' },
  { key: 'products.view', group: 'Дэлгүүр', label: 'Бараа харах' },
  { key: 'products.manage', group: 'Дэлгүүр', label: 'Бараа удирдах' },
  { key: 'competitions.view', group: 'Тэмцээн & сургалт', label: 'Тэмцээн харах' },
  { key: 'competitions.manage', group: 'Тэмцээн & сургалт', label: 'Тэмцээн удирдах' },
  { key: 'trainings.view', group: 'Тэмцээн & сургалт', label: 'Сургалт харах' },
  { key: 'trainings.manage', group: 'Тэмцээн & сургалт', label: 'Сургалт удирдах' },
  { key: 'orders.view', group: 'Санхүү', label: 'Захиалга харах' },
  { key: 'orders.manage', group: 'Санхүү', label: 'Захиалга удирдах' },
  { key: 'transactions.view', group: 'Санхүү', label: 'Гүйлгээ харах' },
  { key: 'notices.view', group: 'Клуб', label: 'Мэдэгдэл харах' },
  { key: 'notices.manage', group: 'Клуб', label: 'Мэдэгдэл удирдах' },
  { key: 'attendance.view', group: 'Клуб', label: 'Ирц харах' },
  { key: 'attendance.scan', group: 'Клуб', label: 'QR уншуулах / бүртгэх' },
  { key: 'site.view', group: 'Вэб сайт', label: 'Вэб хуудас харах' },
  { key: 'site.manage', group: 'Вэб сайт', label: 'Вэб хуудас засах' },
  { key: 'scoring.view', group: 'Оноо', label: 'Оноо, үр дүн харах' },
  { key: 'scoring.enter', group: 'Оноо', label: 'Оноо оруулах' },
  { key: 'scoring.manage', group: 'Оноо', label: 'Тоглолт удирдах, оноо засах' },
  { key: 'scoring.sync', group: 'Оноо', label: 'Синк зөрчил шийдвэрлэх' },
  { key: 'settings.manage', group: 'Систем', label: 'Клубийн тохиргоо' },
  { key: 'roles.manage', group: 'Систем', label: 'Эрх, үүрэг удирдах' },
  { key: 'member_types.manage', group: 'Систем', label: 'Гишүүний төрөл удирдах' },
  { key: 'activities.manage', group: 'Систем', label: 'Хөгжлийн хөтөлбөр удирдах' },
  { key: 'match_types.manage', group: 'Систем', label: 'Тоглолтын төрөл удирдах' },
  { key: 'divisions.manage', group: 'Систем', label: 'Ангилал удирдах' },
  { key: 'staff.manage', group: 'Систем', label: 'Админ хэрэглэгч удирдах' },
];

const MEMBER_PERMISSIONS = [
  { key: 'app.home', group: 'Үндсэн', label: 'Нүүр хуудас харах' },
  { key: 'app.profile', group: 'Үндсэн', label: 'Профайл харах' },
  { key: 'app.notices', group: 'Үндсэн', label: 'Мэдэгдэл харах' },
  { key: 'app.leaderboard', group: 'Үндсэн', label: 'Чансаа харах' },
  { key: 'app.store.view', group: 'Дэлгүүр', label: 'Дэлгүүр харах' },
  { key: 'app.store.buy', group: 'Дэлгүүр', label: 'Бараа захиалах' },
  { key: 'app.wallet', group: 'Дэлгүүр', label: 'Хэтэвч харах' },
  { key: 'app.attendance', group: 'Бэлтгэл', label: 'Өдөр тутмын бэлтгэл / QR' },
  { key: 'app.training.hpa', group: 'Бэлтгэл', label: 'Хийн карабин, ГСК сургалт' },
  { key: 'app.training.mpbh_discount', group: 'Бэлтгэл', label: 'МПБХ-ны хөнгөлөлттэй сургалт' },
  { key: 'app.match.practice', group: 'Тэмцээн', label: 'Бэлтгэл тэмцээнд бүртгүүлэх' },
  { key: 'app.match.level1', group: 'Тэмцээн', label: '1-р түвшний тэмцээнд бүртгүүлэх' },
  { key: 'app.match.level2', group: 'Тэмцээн', label: '2-р түвшний тэмцээнд бүртгүүлэх' },
  { key: 'app.match.level3', group: 'Тэмцээн', label: '3+ түвшний тэмцээнд бүртгүүлэх' },
  { key: 'app.event.fire_day', group: 'Арга хэмжээ', label: 'Галт өдөрлөгт оролцох' },
  { key: 'app.fee.club', group: 'Хураамж', label: 'Клубийн жилийн хураамж' },
  { key: 'app.fee.mpbh', group: 'Хураамж', label: 'МПБХ-ны жилийн татвар' },
];

const JUDGE_PERMISSIONS = [
  { key: 'score.app.access', group: 'Үндсэн', label: 'Score апп нэвтрэх' },
  { key: 'score.matches.view', group: 'Үндсэн', label: 'Тоглолт харах' },
  { key: 'score.results.view', group: 'Үндсэн', label: 'Үр дүн харах' },
  { key: 'score.level.view', group: 'Үндсэн', label: 'Шүүгчийн түвшин харах' },
  { key: 'score.scores.enter.training', group: 'Оноо', label: 'Бэлтгэл тэмцээнд оноо оруулах' },
  { key: 'score.scores.enter.club_l1', group: 'Оноо', label: '1-р түвшний тэмцээнд оноо оруулах' },
  { key: 'score.scores.enter.club_l2', group: 'Оноо', label: '2-р түвшин / МПБХ-д оноо оруулах' },
  { key: 'score.sync', group: 'Оноо', label: 'Синк зөрчил шийдвэрлэх' },
  { key: 'score.duty.aro.training', group: 'Үүрэг', label: 'Бэлтгэлд ARO ажиллах' },
  { key: 'score.duty.ro.training', group: 'Үүрэг', label: 'Бэлтгэлд RO ажиллах' },
  { key: 'score.duty.aro.club_l1', group: 'Үүрэг', label: '1-р түвшинд ARO ажиллах' },
  { key: 'score.duty.ro.club_l1', group: 'Үүрэг', label: '1-р түвшинд RO ажиллах' },
  { key: 'score.duty.aro.club_l2', group: 'Үүрэг', label: '2-р түвшин / МПБХ-д ARO' },
  { key: 'score.duty.ro.club_l2', group: 'Үүрэг', label: '2-р түвшин / МПБХ-д RO' },
  { key: 'score.duty.cro', group: 'Үүрэг', label: 'CRO ажиллах' },
  { key: 'score.duty.rm', group: 'Үүрэг', label: 'Range Master ажиллах' },
  { key: 'score.control', group: 'Удирдлага', label: 'Тэмцээний удирдлага' },
  { key: 'score.stages.edit', group: 'Удирдлага', label: 'Талбай засах' },
];

const KIND_META = {
  admin: {
    key: 'admin',
    label: 'Админ вэб',
    description: 'Prime Admin вэбийн 4 төрөл: Ерөнхий, Ахлах, Админ, Туслах.',
  },
  member: {
    key: 'member',
    label: 'Prime апп',
    description: 'Гишүүнчлэлийн 4 төрөл: Суралцагч, I, II, III түвшин.',
  },
  judge: {
    key: 'judge',
    label: 'Score апп',
    description: 'Шүүгчийн 4 түвшин: LEVEL I RO, LEVEL II RO, LEVEL III RO, NROI.',
  },
};

const ADMIN_KEYS = ADMIN_PERMISSIONS.map((p) => p.key);
const MEMBER_KEYS = MEMBER_PERMISSIONS.map((p) => p.key);
const JUDGE_KEYS = JUDGE_PERMISSIONS.map((p) => p.key);

const MEMBER_CORE = [
  'app.home',
  'app.profile',
  'app.notices',
  'app.leaderboard',
  'app.store.view',
  'app.store.buy',
  'app.wallet',
];

const ROLE_PRESETS = {
  'head-admin': ADMIN_KEYS,
  'senior-admin': ADMIN_KEYS.filter((k) => k !== 'roles.manage'),
  admin: [
    'dashboard.view',
    'members.view',
    'members.create',
    'members.update',
    'members.topup',
    'parents.view',
    'parents.manage',
    'judges.view',
    'judges.manage',
    'products.view',
    'products.manage',
    'competitions.view',
    'competitions.manage',
    'trainings.view',
    'trainings.manage',
    'orders.view',
    'orders.manage',
    'transactions.view',
    'notices.view',
    'notices.manage',
    'attendance.view',
    'attendance.scan',
    'site.view',
    'site.manage',
    'scoring.view',
    'scoring.enter',
    'scoring.manage',
    'scoring.sync',
  ],
  'assistant-admin': [
    'dashboard.view',
    'members.view',
    'parents.view',
    'judges.view',
    'products.view',
    'competitions.view',
    'trainings.view',
    'orders.view',
    'transactions.view',
    'notices.view',
    'notices.manage',
    'attendance.view',
    'attendance.scan',
    'site.view',
    'scoring.view',
  ],
  'student-member': [
    ...MEMBER_CORE,
    'app.attendance',
    'app.match.practice',
    'app.match.level1',
  ],
  'level-1-member': [
    ...MEMBER_CORE,
    'app.attendance',
    'app.match.practice',
    'app.match.level1',
    'app.training.hpa',
    'app.fee.club',
  ],
  'level-2-member': [
    ...MEMBER_CORE,
    'app.attendance',
    'app.match.practice',
    'app.match.level1',
    'app.match.level2',
    'app.training.hpa',
    'app.event.fire_day',
    'app.fee.club',
    'app.fee.mpbh',
  ],
  'level-3-member': MEMBER_KEYS,
  'level-i-ro': [
    'score.app.access',
    'score.matches.view',
    'score.results.view',
    'score.level.view',
    'score.duty.aro.training',
  ],
  'level-ii-ro': [
    'score.app.access',
    'score.matches.view',
    'score.results.view',
    'score.level.view',
    'score.scores.enter.training',
    'score.duty.aro.training',
    'score.duty.ro.training',
    'score.duty.aro.club_l1',
  ],
  'level-iii-ro': [
    'score.app.access',
    'score.matches.view',
    'score.results.view',
    'score.level.view',
    'score.scores.enter.training',
    'score.scores.enter.club_l1',
    'score.duty.aro.training',
    'score.duty.ro.training',
    'score.duty.aro.club_l1',
    'score.duty.ro.club_l1',
    'score.duty.aro.club_l2',
    'score.duty.cro',
    'score.duty.rm',
    'score.control',
    'score.stages.edit',
    'score.sync',
  ],
  nroi: [
    'score.app.access',
    'score.matches.view',
    'score.results.view',
    'score.level.view',
    'score.scores.enter.training',
    'score.scores.enter.club_l1',
    'score.scores.enter.club_l2',
    'score.duty.ro.training',
    'score.duty.ro.club_l1',
    'score.duty.ro.club_l2',
    'score.control',
    'score.stages.edit',
    'score.sync',
  ],
};

const SYSTEM_ROLES = [
  {
    slug: 'head-admin',
    name: 'Ерөнхий админ',
    description: 'Бүх эрхтэй, RBAC-ийг удирдана',
    kind: 'admin',
    isSuper: true,
    isSystem: true,
    sortOrder: 1,
  },
  {
    slug: 'senior-admin',
    name: 'Ахлах админ',
    description: 'RBAC-ээс бусад бүх үйлдэл',
    kind: 'admin',
    isSuper: false,
    isSystem: true,
    sortOrder: 2,
  },
  {
    slug: 'admin',
    name: 'Админ',
    description: 'Өдөр тутмын клубийн үйл ажиллагаа',
    kind: 'admin',
    isSuper: false,
    isSystem: true,
    sortOrder: 3,
  },
  {
    slug: 'assistant-admin',
    name: 'Туслах админ',
    description: 'Харах болон хязгаартай бичих эрх',
    kind: 'admin',
    isSuper: false,
    isSystem: true,
    sortOrder: 4,
  },
  {
    slug: 'student-member',
    name: 'Суралцагч гишүүн',
    description: 'Prime апп — анхан шатны гишүүн',
    kind: 'member',
    isSuper: false,
    isSystem: true,
    sortOrder: 11,
  },
  {
    slug: 'level-1-member',
    name: 'I түвшний гишүүн',
    description: 'Prime апп — LEVEL I MEMBER',
    kind: 'member',
    isSuper: false,
    isSystem: true,
    sortOrder: 12,
  },
  {
    slug: 'level-2-member',
    name: 'II түвшний гишүүн',
    description: 'Prime апп — LEVEL II MEMBER',
    kind: 'member',
    isSuper: false,
    isSystem: true,
    sortOrder: 13,
  },
  {
    slug: 'level-3-member',
    name: 'III түвшний гишүүн',
    description: 'Prime апп — LEVEL III MEMBER',
    kind: 'member',
    isSuper: false,
    isSystem: true,
    sortOrder: 14,
  },
  {
    slug: 'level-i-ro',
    name: 'LEVEL I RO',
    description: 'Score апп — дадлагажигч шүүгч',
    kind: 'judge',
    isSuper: false,
    isSystem: true,
    sortOrder: 21,
  },
  {
    slug: 'level-ii-ro',
    name: 'LEVEL II RO',
    description: 'Score апп — клубийн шүүгч',
    kind: 'judge',
    isSuper: false,
    isSystem: true,
    sortOrder: 22,
  },
  {
    slug: 'level-iii-ro',
    name: 'LEVEL III RO',
    description: 'Score апп — шүүгчдийн зөвлөлийн гишүүн',
    kind: 'judge',
    isSuper: false,
    isSystem: true,
    sortOrder: 23,
  },
  {
    slug: 'nroi',
    name: 'NROI',
    description: 'Score апп — МПБХ-ны шүүгч',
    kind: 'judge',
    isSuper: false,
    isSystem: true,
    sortOrder: 24,
  },
];

const PERMISSIONS = ADMIN_PERMISSIONS;
const ALL_KEYS = ADMIN_KEYS;
const PERMISSIONS_BY_KIND = {
  admin: ADMIN_PERMISSIONS,
  member: MEMBER_PERMISSIONS,
  judge: JUDGE_PERMISSIONS,
};

function groupedPermissions(list = ADMIN_PERMISSIONS) {
  const groups = {};
  for (const item of list) {
    groups[item.group] = groups[item.group] || [];
    groups[item.group].push(item);
  }
  return groups;
}

function catalogs() {
  return Object.fromEntries(
    Object.entries(KIND_META).map(([kind, meta]) => [
      kind,
      {
        ...meta,
        permissions: PERMISSIONS_BY_KIND[kind],
        grouped: groupedPermissions(PERMISSIONS_BY_KIND[kind]),
      },
    ])
  );
}

function validKeysForKind(kind) {
  return new Set((PERMISSIONS_BY_KIND[kind] || []).map((p) => p.key));
}

function sanitizePermissions(kind, permissions) {
  const allowed = validKeysForKind(kind);
  return (permissions || []).filter((key) => key === '*' || allowed.has(key));
}

function memberRoleSlug(member = {}) {
  const type = member.MemberType || member.memberType || {};
  const category = type.category || member.category || '';
  if (category === 'junior') {
    const juniorLevel = Number(type.level ?? member.memberTypeLevel ?? 1);
    if (juniorLevel >= 3) return 'level-3-member';
    if (juniorLevel === 2) return 'level-2-member';
    return 'student-member';
  }
  const computed = Number(member.level ?? 0);
  const typed = Number(type.level ?? 0);
  const level = Math.max(computed, Number.isFinite(typed) ? typed : 0);
  if (level <= 0) return 'student-member';
  if (level >= 3) return 'level-3-member';
  if (level === 2) return 'level-2-member';
  return 'level-1-member';
}

function judgeRoleSlug(judge = {}) {
  const raw = String(judge.certificationLevel || '').toUpperCase();
  if (raw.includes('NROI')) return 'nroi';
  if (raw.includes('III') || raw.includes('LEVEL_3')) return 'level-iii-ro';
  if (raw.includes('II') || raw.includes('LEVEL_2')) return 'level-ii-ro';
  return 'level-i-ro';
}

function matchPermissionForCompetition(competition = {}) {
  const hay = [
    competition.level,
    competition.title,
    competition.subtitle,
    competition.organizer,
    ...(Array.isArray(competition.tags) ? competition.tags : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (/галт\s*өдөр|fire\s*day|celebration/.test(hay)) return 'app.event.fire_day';
  if (/бэлтгэл|training|practice|classifier/.test(hay)) return 'app.match.practice';
  if (/мпбх|mpbh|level\s*(3|4|5|iii|iv|v)\b|3-р\s*түвш|3\+\s*түвш/.test(hay)) return 'app.match.level3';
  if (/level\s*(2|ii)\b|2-р\s*түвш|2р\s*түвш|уашт|yaht/.test(hay)) return 'app.match.level2';
  return 'app.match.level1';
}

function scoreEnterPermission(tier) {
  const value = String(tier || '').toUpperCase();
  if (value === 'TRAINING') return 'score.scores.enter.training';
  if (value === 'CLUB_L1') return 'score.scores.enter.club_l1';
  return 'score.scores.enter.club_l2';
}

module.exports = {
  PERMISSIONS,
  ALL_KEYS,
  ADMIN_PERMISSIONS,
  MEMBER_PERMISSIONS,
  JUDGE_PERMISSIONS,
  ADMIN_KEYS,
  MEMBER_KEYS,
  JUDGE_KEYS,
  ROLE_PRESETS,
  SYSTEM_ROLES,
  KIND_META,
  PERMISSIONS_BY_KIND,
  groupedPermissions,
  catalogs,
  sanitizePermissions,
  memberRoleSlug,
  judgeRoleSlug,
  matchPermissionForCompetition,
  scoreEnterPermission,
};
