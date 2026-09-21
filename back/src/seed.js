require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const {
  sequelize,
  Admin,
  Role,
  Member,
  MemberType,
  DevelopmentActivity,
  Product,
  Competition,
  Training,
  Notice,
  Transaction,
  Setting,
} = require('./models');
const { ROLE_PRESETS } = require('./rbac/catalog');
const { uploadLocal } = require('./utils/media');

async function run() {
  await sequelize.sync({ force: true });

  const roles = await Role.bulkCreate([
    { name: 'Head admin', slug: 'head-admin', description: 'Full access, including RBAC', isSuper: true, isSystem: true, sortOrder: 1, permissions: ROLE_PRESETS['head-admin'] },
    { name: 'Senior admin', slug: 'senior-admin', description: 'All operations except role matrix', isSuper: false, isSystem: true, sortOrder: 2, permissions: ROLE_PRESETS['senior-admin'] },
    { name: 'Admin', slug: 'admin', description: 'Day-to-day club operations', isSuper: false, isSystem: true, sortOrder: 3, permissions: ROLE_PRESETS.admin },
    { name: 'Assistant admin', slug: 'assistant-admin', description: 'View and limited write', isSuper: false, isSystem: true, sortOrder: 4, permissions: ROLE_PRESETS['assistant-admin'] },
  ]);
  const headRole = roles.find((r) => r.slug === 'head-admin');

  const memberTypes = await MemberType.bulkCreate([
    { name: 'Student member', slug: 'student-member', category: 'student', isInactive: false, requiresParent: false, hasAppAccess: true, isSystem: true, sortOrder: 1 },
    { name: 'Student inactive member', slug: 'student-inactive', category: 'student', isInactive: true, requiresParent: false, hasAppAccess: false, isSystem: true, sortOrder: 2 },
    { name: 'Official L1 member', slug: 'official-l1', category: 'official', level: 1, isInactive: false, requiresParent: false, hasAppAccess: true, isSystem: true, sortOrder: 3 },
    { name: 'Official L2 member', slug: 'official-l2', category: 'official', level: 2, isInactive: false, requiresParent: false, hasAppAccess: true, isSystem: true, sortOrder: 4 },
    { name: 'Official L3 member', slug: 'official-l3', category: 'official', level: 3, isInactive: false, requiresParent: false, hasAppAccess: true, isSystem: true, sortOrder: 5 },
    { name: 'Official inactive member', slug: 'official-inactive', category: 'official', isInactive: true, requiresParent: false, hasAppAccess: false, isSystem: true, sortOrder: 6 },
    { name: 'Junior L1 member + parent', slug: 'junior-l1', category: 'junior', level: 1, isInactive: false, requiresParent: true, hasAppAccess: true, isSystem: true, sortOrder: 7 },
    { name: 'Junior L2 member + parent', slug: 'junior-l2', category: 'junior', level: 2, isInactive: false, requiresParent: true, hasAppAccess: true, isSystem: true, sortOrder: 8 },
    { name: 'Junior L3 member + parent', slug: 'junior-l3', category: 'junior', level: 3, isInactive: false, requiresParent: true, hasAppAccess: true, isSystem: true, sortOrder: 9 },
    { name: 'Junior inactive member', slug: 'junior-inactive', category: 'junior', isInactive: true, requiresParent: true, hasAppAccess: false, isSystem: true, sortOrder: 10 },
  ]);
  const officialL2 = memberTypes.find((t) => t.slug === 'official-l2');

  const media = {
    avatar: await uploadLocal('avatar.png'),
    bbPellets: await uploadLocal('bb_pellets.png'),
    greenGas: await uploadLocal('green_gas.png'),
    gloves: await uploadLocal('tactical_gloves.png'),
    jersey: await uploadLocal('prime_jersey.png'),
    primeCup: await uploadLocal('prime_cup.png'),
    winter: await uploadLocal('winter_challenge.png'),
    training: await uploadLocal('tactical_training.png'),
  };

  const activities = await DevelopmentActivity.bulkCreate([
    { name: 'RODP L1', slug: 'rodp-l1', description: 'RODP level 1', isSystem: true, sortOrder: 1 },
    { name: 'RODP L2', slug: 'rodp-l2', description: 'RODP level 2', isSystem: true, sortOrder: 2 },
    { name: 'RODP L3', slug: 'rodp-l3', description: 'RODP level 3', isSystem: true, sortOrder: 3 },
    { name: 'YASDP', slug: 'yasdp', description: 'YASDP program', isSystem: true, sortOrder: 4 },
    { name: 'SMDP', slug: 'smdp', description: 'SMDP program', isSystem: true, sortOrder: 5 },
    { name: 'Full-Time Employee', slug: 'full-time-employee', description: 'Full-time staff', isSystem: true, sortOrder: 6 },
    { name: 'Half-Time Employee', slug: 'half-time-employee', description: 'Part-time staff', isSystem: true, sortOrder: 7 },
  ]);
  const smdp = activities.find((a) => a.slug === 'smdp');

  await Admin.create({
    name: 'PRIME Admin',
    email: 'admin@prime.mn',
    passwordHash: await bcrypt.hash('PrimeAdmin0328', 10),
    roleId: headRole.id,
  });

  const temuulen = await Member.create({
    name: 'Temuulen',
    memberCode: 'PRIME-000125',
    pinHash: await bcrypt.hash('PRIME-000125', 10),
    phone: '+976 9900 0000',
    avatarUrl: media.avatar,
    motto: 'Багтай бай. Илүү хол явна.',
    level: 18,
    rank: 8,
    competitionCount: 12,
    validFrom: '2026-09-15',
    validTo: '2026-12-15',
    status: 'active',
    walletBalance: 125000,
    memberTypeId: officialL2.id,
    developmentActivityId: smdp.id,
  });

  await Product.bulkCreate([
    {
      name: 'BB Pellets',
      price: 18000,
      imageUrl: media.bbPellets,
      category: 'bb',
      categoryLabel: 'АКСЕССУАР',
      subtitle: '0.20g / 5000 ширхэг',
      description: '0.20g airsoft сум. Тогтвортой нисэлт, нарийн буудахад зориулагдсан.',
      features: ['Тогтвортой нисэлт', 'Өндөр нарийвчлал', 'Байгаль ээлтэй материал'],
      sortOrder: 1,
    },
    {
      name: 'Green Gas',
      price: 25000,
      imageUrl: media.greenGas,
      category: 'gas',
      categoryLabel: 'ХИЙ',
      subtitle: '650ml / High Performance',
      description: 'Өндөр гүйцэтгэлтэй green gas. Тогтвортой даралт, хүйтэн цагт ч найдвартай.',
      features: ['650ml багтаамж', 'Тогтвортой даралт', 'Өндөр гүйцэтгэл'],
      sortOrder: 2,
    },
    {
      name: 'Tactical Gloves',
      price: 45000,
      imageUrl: media.gloves,
      category: 'clothing',
      categoryLabel: 'ХУВЦАС',
      subtitle: 'Тактикийн бээлий',
      description: 'Бариул бат бөх, хурууны мэдрэмж сайтай тактикийн бээлий.',
      features: ['Бариул бат', 'Амьсгалдаг материал', 'PRIME стандарт'],
      sortOrder: 3,
    },
    {
      name: 'PRIME Jersey',
      price: 59000,
      imageUrl: media.jersey,
      category: 'clothing',
      categoryLabel: 'ХУВЦАС',
      subtitle: 'Албан ёсны хувцас',
      description: 'Клубын албан ёсны өмсгөл. Тэмцээн, сургалт бүрт нэг багийн төрх.',
      features: ['Албан ёсны лого', 'Хөнгөн материал', 'Тактик камуфляж'],
      sortOrder: 4,
    },
  ]);

  await Competition.bulkCreate([
    {
      title: 'PRIME CUP 2026',
      subtitle: 'Багийн тэмцээн',
      eventDate: '2026-10-12',
      location: 'Ulaanbaatar',
      imageUrl: media.primeCup,
      capacity: 50,
      fee: 50000,
      about:
        'PRIME CUP 2026 нь багийн ур чадвар, тактик, хамтын ажиллагааг хамгийн том талбайд сорих тэмцээн юм.',
      facts: [
        { icon: 'group', title: '4 хүний баг', body: 'Нэг баг 4 гишүүнээс бүрдэнэ.' },
        { icon: 'target', title: '3 үе шат', body: 'Тактик, ур чадвар, багийн ажиллагаа.' },
        { icon: 'fee', title: 'Бүртгэлийн хураамж ₮50,000', body: 'Нэг багийн бүртгэлийн хураамж.' },
        { icon: 'members', title: 'Гишүүдэд нээлттэй', body: 'PRIME клубын гишүүнээр оролцоно.' },
      ],
      tags: ['SKILLS', 'TACTICS', 'TEAMWORK'],
      status: 'open',
    },
    {
      title: 'Winter Challenge',
      subtitle: 'Хувийн тэмцээн',
      eventDate: '2026-11-20',
      location: 'Indoor Arena',
      imageUrl: media.winter,
      capacity: 40,
      fee: 40000,
      about: 'Өвлийн сорил. Бүдсаагүй, байрлал, харилцаа, тэсвэр — бүгдийг нэг дор шалгана.',
      facts: [
        { icon: 'group', title: 'Хувийн ангилал', body: 'Ганцаарчилсан оролцоо.' },
        { icon: 'target', title: 'Дотор талбай', body: 'Indoor Arena дээр зохион байгуулагдана.' },
        { icon: 'fee', title: 'Бүртгэлийн хураамж ₮40,000', body: 'Урьдчилсан бүртгэл.' },
      ],
      tags: ['ADAPT', 'SURVIVE', 'OUTPLAY'],
      status: 'upcoming',
    },
  ]);

  await Training.create({
    title: 'Тактикийн сургалт',
    subtitle: 'Багаараа хөдөлнө, байрлал, харилцаа холбоо',
    eventDate: '2026-10-05',
    timeLabel: '14:00 – 17:00',
    imageUrl: media.training,
    capacity: 24,
    fee: 50000,
  });

  await Notice.bulkCreate([
    {
      title: 'PRIME CUP бүртгэл нээгдлээ',
      body: '2026.10.12-ны багийн тэмцээнд бүртгүүлэхэд ₮50,000.',
    },
    {
      title: 'Клуб өнөөдөр нээлттэй',
      body: 'Өнөөдөр 12/40 тоглогч бүртгүүлсэн. Ирцээ QR-ээр уншуулна уу.',
    },
  ]);

  await Transaction.bulkCreate([
    { memberId: temuulen.id, title: 'Wallet цэнэглэл', amount: 100000, kind: 'topup', createdAt: new Date('2026-10-12T14:32:00') },
    { memberId: temuulen.id, title: 'BB Pellets', amount: -18000, kind: 'purchase', createdAt: new Date('2026-10-10T16:45:00') },
    { memberId: temuulen.id, title: 'Training Fee', amount: -50000, kind: 'fee', createdAt: new Date('2026-10-05T11:20:00') },
  ]);

  await Setting.bulkCreate([
    { key: 'club', value: { open: true, todayCount: 12, capacity: 40 } },
    { key: 'brand', value: { name: 'PRIME', tagline: 'Play. Train. Compete. Belong.' } },
  ]);

  console.log('Seeded PRIME database.');
  console.log('Admin: admin@prime.mn / PrimeAdmin0328');
  console.log('Member: Temuulen / PRIME-000125');
  await sequelize.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
