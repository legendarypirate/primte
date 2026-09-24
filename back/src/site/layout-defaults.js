const DEFAULT_NAV = [
  { label: 'Нүүр', href: '/' },
  { label: 'Бидний тухай', href: '/about' },
  { label: 'Сургалт', href: '/training' },
  { label: 'Гишүүнчлэл', href: '/membership' },
  { label: 'Тэмцээн', href: '/ranking' },
  { label: 'Мэдээ', href: '/#news' },
  { label: 'Холбоо барих', href: '/contact' },
];

const DEFAULT_HEADER = {
  logoUrl: '',
  brandName: 'PRIME',
  brandBadge: 'IPSC',
  brandSubtitle: 'PRACTICAL SHOOTING CLUB',
  navItems: DEFAULT_NAV,
  ctaText: 'БҮРТГҮҮЛЭХ',
  ctaHref: '/training',
  showSearch: true,
};

const DEFAULT_FOOTER = {
  description:
    'Илүү сайн хүн, Илүү аюулгүй нийгэм.\nПрактик буудлагын спортоор дамжуулан сахилга бат, хариуцлага, манлайлыг төлөвшүүлнэ.',
  linksLabel: 'ХОЛБООС',
  navItems: DEFAULT_NAV,
  extraLinks: [{ label: 'Дэлгүүр', href: '/training#shop' }],
  contactLabel: 'ХОЛБОО БАРИХ',
  phone: '8611-0200',
  email: 'registration@prime.mn',
  address: 'Улаанбаатар, Монгол Улс',
  socialLabel: 'FOLLOW US',
  socials: [
    { label: 'FB', href: 'https://facebook.com' },
    { label: 'IG', href: 'https://instagram.com' },
    { label: 'YT', href: 'https://youtube.com' },
  ],
  mottoLines: ['DISCIPLINE', 'SKILL', 'A SAFER TOMORROW'],
  copyright: '© 2024 PRIME IPSC Club. Бүх эрх хуулиар хамгаалагдсан.',
  badges: ['IPSC ACTION AIR CLUB', 'MONGOLIA'],
};

module.exports = {
  DEFAULT_HEADER,
  DEFAULT_FOOTER,
  DEFAULT_LAYOUT: { header: DEFAULT_HEADER, footer: DEFAULT_FOOTER },
};
