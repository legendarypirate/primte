const { randomUUID } = require('crypto');

function block(type, data) {
  return { id: randomUUID(), type, data };
}

const DEFAULT_PAGES = [
  {
    slug: 'home',
    title: 'Нүүр хуудас',
    metaTitle: 'PRIME Practical Shooting Club',
    metaDescription: 'IPSC Action Air клуб — аюулгүй, мэргэжлийн практик буудлагын сургалт, тэмцээн.',
    sortOrder: 1,
    blocks: [
      block('hero', {
        eyebrow: 'PRIME IPSC CLUB',
        title: 'PRACTICAL SHOOTING',
        description:
          'Аюулгүй байдал, сахилга бат, техник ур чадварыг нэгтгэсэн IPSC Action Air клуб. Анхан шатнаас олон улсын түвшин хүртэлх сургалт, тэмцээн, нийгэмлэг.',
        primaryCta: { text: 'Сургалт үзэх', href: '/training' },
        secondaryCta: { text: 'Гишүүнчлэл', href: '/membership' },
        asideTag: 'PRIME IPSC CLUB',
        asideTitle: 'DISCIPLINE · SKILL · COMMUNITY',
        asideBody: 'Аюулгүй байдал, сахилга бат, техник ур чадварыг нэгтгэсэн олон улсын практик буудлагын соёл.',
      }),
      block('section-header', {
        anchorId: 'safety',
        number: '01',
        label: 'SAFETY FIRST',
        title: 'АЮУЛГҮЙ АЖИЛЛАГАА',
        description: 'Практик буудлагын үндсэн дүрэм — бүх гишүүд заавал мөрдөнө.',
      }),
      block('numbered-list', {
        items: [
          { n: '01', title: 'Зэвсгийг үргэлж аюулгүй чиглэлд барина.', body: 'Буудлага хийгээгүй үед ч бууны хошуу үргэлж аюулгүй чиглэлд заагдсан байна.' },
          { n: '02', title: 'Сүмтүй эсэхийг үргэлж шалгана.', body: 'Зэвсгийг гартаа авах бүрт хөг, замаг шалгаж аюулгүй байдлыг хангах ёстой.' },
          { n: '03', title: 'Триггер дээр хуруугаа байршуулахгүй.', body: 'Зорилтонд буудах бэлэн болоогүй тохиолдолд хурууг спускээс гадуур барина.' },
          { n: '04', title: 'Зорилтоо болон түүний цаад орчныг танина.', body: 'Зорилтонд буудахын өмнө зорилт ба түүний арын орчныг бүрэн шалгана.' },
        ],
      }),
      block('section-header', {
        number: '02',
        label: 'WHY PRIME',
        title: 'ЯАГААД PRIME ВЭ?',
        description: 'IPSC Action Air-д зориулсан бүтэцлэгдсэн сургалт, тэмцээний систем.',
      }),
      block('icon-cards', {
        items: [
          { icon: 'Target', title: 'Зэвсгийн ангилал', body: 'IPSC Action Air-д зөвхөн S.A. зөвшөөрөгдсөн airsoft зэвсэг ашиглана.', href: '/about' },
          { icon: 'Crosshair', title: 'Дасгалын зохиомж', body: 'Хөдөлгөөн, байрлал, оновч дараалал бүхий бодит нөхцөлтэй дасгалууд.', href: '/training' },
          { icon: 'BarChart3', title: 'Тэмцээний түвшин', body: 'Орон нутгаас олон улсын түвшний тэмцээнүүд.', href: '/ranking' },
          { icon: 'ShieldAlert', title: 'Тэмцээнээс хасах (DQ)', body: 'Аюулгүй ажиллагааны зөрчил, дүрэм зөрчсөн тохиолдолд тэмцээнээс хасна.', href: '/about' },
        ],
      }),
      block('section-header', {
        anchorId: 'training',
        number: '03',
        label: 'TRAINING PATH',
        title: 'СУРГАЛТЫН ТҮВШИН',
        description: 'Level I-ээс Level V хүртэлх олон улсын түвшний замнал.',
      }),
      block('stepper', {
        steps: [
          { n: '1', title: 'Level I', label: 'Клубын ТҮВШИН' },
          { n: '2', title: 'Level II', label: 'Бүсийн ТҮВШИН' },
          { n: '3', title: 'Level III', label: 'Үндэсний ТҮВШИН' },
          { n: '4', title: 'Level IV', label: 'Олон улсын ТҮВШИН' },
          { n: '5', title: 'Level V', label: 'Дэлхийн аварга шалгаруулах ТҮВШИН' },
        ],
      }),
      block('section-header', {
        number: '04',
        label: 'COURSES',
        title: 'СУРГАЛТУУД',
        description: 'Анхан шатнаас дээд түвшин хүртэлх бүтэцлэгдсэн хөтөлбөрүүд.',
      }),
      block('course-cards', {
        items: [
          { title: 'COURSE 1', subtitle: 'Гишүүнчлэлийн сургалт', duration: '2 өдөр', audience: 'Анхан шат', details: 'Аюулгүй ажиллагаа, үндсэн техник, IPSC суурь мэдлэг', price: '350,000₮', href: '/training/course-1' },
          { title: 'COURSE 2', subtitle: 'Гишүүнчлэлийн сургалт', duration: '2 өдөр', audience: 'Анхан шат (C1 төгссөн)', details: 'Дээд техник, стратеги, тэмцээний бэлтгэл', price: '350,000₮', href: '/training/course-2' },
          { title: 'Junior хөтөлбөр', subtitle: 'Жуниор хөтөлбөр', duration: '4 долоо хоног', audience: '12-17 нас', details: 'Аюулгүй байдал, оновчтой ур чадвар, зөв дадал', price: '250,000₮', href: '/training/junior' },
        ],
      }),
      block('section-header', {
        anchorId: 'membership',
        number: '05',
        label: 'MEMBERSHIP',
        title: 'ГИШҮҮНЧЛЭЛ',
        description: 'Клубын гишүүн болж, бүх боломжийг ашиглаарай.',
      }),
      block('cta-banner', {
        title: 'PRIME-д нэгдэх',
        description: 'Сургалт, тэмцээн, нийгэмлэг — бүгд нэг дор.',
        ctaText: 'Гишүүнчлэлийн мэдээлэл',
        ctaHref: '/membership',
      }),
      block('section-header', {
        anchorId: 'news',
        number: '06',
        label: 'NEWS',
        title: 'МЭДЭЭ, МЭДЭГДЭЛ',
        description: 'Клубын сүүлийн үеийн мэдээ, тэмцээний мэдэгдэл.',
      }),
      block('news-list', {
        items: [
          { date: '2024.12.01', title: 'Өвлийн Challenge тэмцээн', body: '12-р сарын 15-нд зохион байгуулагдана.' },
          { date: '2024.11.15', title: 'Course 1 бүртгэл эхэллээ', body: 'Шинэ гишүүдийн сургалтын бүртгэл нээлттэй.' },
          { date: '2024.11.01', title: 'Клубын шинэ дүрэм', body: 'IPSC Action Air дүрмийн шинэчлэлийг уншина уу.' },
        ],
      }),
    ],
  },
  {
    slug: 'about',
    title: 'Бидний тухай',
    metaTitle: 'Бидний тухай | PRIME',
    metaDescription: 'PRIME Practical Shooting Club — 2019 онд байгуулагдсан IPSC Action Air клуб.',
    sortOrder: 2,
    blocks: [
      block('hero', {
        eyebrow: '01 —— ABOUT US',
        title: 'БИДНИЙ ТУХАЙ',
        description:
          'PRIME Practical Shooting Club нь 2019 онд байгуулагдсан IPSC Action Air клуб бөгөөд аюулгүй, хариуцлагатай, чадварлаг тамирчдыг хөгжүүлэхэд зориулагдсан.',
        primaryCta: { text: 'Бидний түүх', href: '#timeline' },
        asideTag: 'PRIME IPSC CLUB',
        asideTitle: 'MORE THAN A SPORT',
        asideBody: 'Аюулгүй байдал, сахилга бат, техник ур чадварыг нэгтгэсэн олон улсын практик буудлагын соёл.',
      }),
      block('stats-row', {
        items: [
          { icon: 'Calendar', value: '2019 онд', label: 'байгуулагдсан' },
          { icon: 'Users', value: '100+', label: 'гишүүн' },
          { icon: 'Trophy', value: '20+', label: 'тэмцээн' },
          { icon: 'Star', value: '10+', label: 'багш / инструктор' },
        ],
      }),
      block('section-header', {
        anchorId: 'history',
        number: '02',
        label: 'HISTORY',
        title: 'БИДНИЙ ТҮҮХ',
        description: '2019 оноос өнөөдөр хүртэлх замнал.',
      }),
      block('timeline', {
        items: [
          { year: '2019', title: 'PRIME клуб байгуулагдав', body: 'Сонирхогчдын багаас эхлэл тавив.' },
          { year: '2020', title: 'Анхны сургалтууд', body: 'Тогтмол сургалт, гишүүдийн тоо өсөв.' },
          { year: '2022', title: 'Орон нутгийн тэмцээнүүд', body: 'Дотоод тэмцээнүүдийг зохион байгуулав.' },
          { year: '2023', title: 'Олон улсын тавцанд', body: 'Гадаад тэмцээнд оролцож, туршлага цуглуулав.' },
          { year: '2024+', title: 'Цаашид хөгжинө', body: 'Илүү олон тамирчин, илүү их боломж.' },
        ],
      }),
      block('section-header', {
        number: '03',
        label: 'TEAM',
        title: 'БАГИЙН ГИШҮҮД',
        description: 'Туршлагатай инструктор, багш нар.',
      }),
      block('team-grid', {
        items: [
          { name: 'Б.ЭНХБАЯР', role: 'Клубын үүсгэн байгуулагч', sub: 'Ерөнхий инструктор' },
          { name: 'Д.ОДБАЯР', role: 'IPSC инструктор', sub: 'Сургалтын багш' },
          { name: 'С.МӨНХТУЛГА', role: 'Ахлах инструктор', sub: 'Техникийн сургалт' },
          { name: 'Г.ЭРДЭНЭ', role: 'Инструктор', sub: 'Аюулгүй ажиллагаа' },
        ],
      }),
      block('gallery', {
        items: [
          { tag: 'СУРГАЛТ', title: 'ХӨГЖИЛ' },
          { tag: 'ТОНОГ ТӨХӨӨРӨМЖ', title: 'МЭРГЭЖИЛ' },
          { tag: 'ХАМТ ОЛОН', title: 'НӨХӨРЛӨЛ' },
          { tag: 'ТЭМЦЭЭН', title: 'АМЖИЛТ' },
        ],
      }),
    ],
  },
  {
    slug: 'training',
    title: 'Сургалт',
    metaTitle: 'Сургалт | PRIME',
    sortOrder: 3,
    blocks: [
      block('hero', {
        eyebrow: 'TRAINING',
        title: 'СУРГАЛТ',
        description: 'IPSC Action Air-д зориулсан бүтэцлэгдсэн сургалтын хөтөлбөрүүд.',
        primaryCta: { text: 'Course 1', href: '/training/course-1' },
        secondaryCta: { text: 'Course 2', href: '/training/course-2' },
      }),
      block('icon-cards', {
        items: [
          { icon: 'Shield', title: 'Аюулгүй байдал', body: 'Бүх сургалт аюулгүй ажиллагааны дүрмээс эхэлнэ.', href: '' },
          { icon: 'Target', title: 'Техник', body: 'Зөв байрлал, хөдөлгөөн, оnovч дараалал.', href: '' },
          { icon: 'Users', title: 'Багш нар', body: 'IPSC инструктор батlamжтай багш нар.', href: '' },
        ],
      }),
      block('course-cards', {
        items: [
          { title: 'COURSE 1', subtitle: 'Гишүүнчлэлийн сургалт', duration: '2 өдөр', audience: 'Анхан шат', details: 'Аюулгүй ажиллагаа, үндсэн техник', price: '370,000₮', href: '/training/course-1' },
          { title: 'COURSE 2', subtitle: 'Дэд түвшний сургалт', duration: '2 өдөр', audience: 'C1 төгссөн', details: 'Дээд техник, стратеги', price: '370,000₮', href: '/training/course-2' },
          { title: 'Junior', subtitle: 'Жуниор хөтөлбөр', duration: '4 долоо хоног', audience: '12-17 нас', details: 'Зөв дадал, аюулгүй байдал', price: '250,000₮', href: '/training/junior' },
        ],
      }),
    ],
  },
  {
    slug: 'membership',
    title: 'Гишүүнчлэл',
    metaTitle: 'Гишүүнчлэл | PRIME',
    sortOrder: 4,
    blocks: [
      block('hero', {
        eyebrow: 'MEMBERSHIP',
        title: 'ГИШҮҮНЧЛЭЛ',
        description: 'PRIME клубын гишүүн болж, сургалт, тэмцээн, нийгэмлэгийн бүх боломжийг ашиглаарай.',
        primaryCta: { text: 'Бүртгүүлэх', href: '/training' },
      }),
      block('pricing-grid', {
        items: [
          { title: 'Student Member', price: '150,000₮/жил', features: ['Сургалтад хямдрал', 'Клубын арга хэмjee'], ctaText: 'Сонгох', ctaHref: '/contact', highlighted: false },
          { title: 'Official Member', price: '250,000₮/жил', features: ['Бүх тэмцээнд оролцох', 'Ranking систем'], ctaText: 'Сонгох', ctaHref: '/contact', highlighted: true },
          { title: 'Junior Member', price: '180,000₮/жил', features: ['Junior хөтөлбөр', 'Эцэг эхийн хяналт'], ctaText: 'Сонгох', ctaHref: '/contact', highlighted: false },
        ],
      }),
    ],
  },
  {
    slug: 'ranking',
    title: 'Ranking',
    metaTitle: 'Ranking | PRIME',
    sortOrder: 5,
    blocks: [
      block('hero', {
        eyebrow: 'RANKING',
        title: 'CLUB RANKING',
        description: 'Клубын дотоод ranking — discipline, skill, community.',
      }),
      block('stats-row', {
        items: [
          { value: '48', label: 'Тамирчин', highlight: false },
          { value: '12', label: 'Тэмцээн', highlight: false },
          { value: '1,240', label: 'Нийт оноо', highlight: true },
        ],
      }),
      block('cta-banner', {
        title: 'Ranking дүрэм',
        description: 'Оноо тооцох, ангилал, шагналын дүрмийг уншина уу.',
        ctaText: 'Дүрэм унших',
        ctaHref: '/ranking/rules',
      }),
    ],
  },
  {
    slug: 'contact',
    title: 'Холбоо барих',
    metaTitle: 'Холбоо барих | PRIME',
    sortOrder: 6,
    blocks: [
      block('contact-hero', {
        eyebrow: 'PRIME PRACTICAL SHOOTING CLUB',
        title: 'ХОЛБОО БАРИХ',
        description: 'Сургалт, гишүүнчлэл, тэмцээн болон бусад бүх төрлийн асуулт, санал хүсэлтээ бидэнтэй холбогдон аваарай.',
        sidebarText: 'Discipline · Skill · Community · A Higher Standard.',
      }),
      block('contact-cards', {
        sectionNumber: '01',
        sectionLabel: 'ХОЛБОО БАРИХ МЭДЭЭЛЭЛ',
        intro: 'Бидэнтэй дараах сувгаар холбогдож, шаардлагатай мэдээллээ аваарай.',
        cards: [
          { icon: 'Phone', title: 'Утасны дугаар', lines: '8611-0200\n9088-0200', note: 'Даваа – Баасан 09:00 – 18:00 цагийн хооронд холбогдоно уу.' },
          { icon: 'Mail', title: 'И-мэйл', lines: 'info@prime.mn\nregistration@prime.mn', note: 'Ерөнхий мэдээлэл болон бүртгэлтэй холбоотой асуултаа и-мэйлээр илгээнэ үү.' },
          { icon: 'MapPin', title: 'Байршил', lines: 'Улаанбаатар, Монгол Улс\nХан-Уул дүүрэг, Яармаг', linkText: 'Google Map дээр нээх →', linkHref: 'https://maps.google.com' },
          { icon: 'Clock', title: 'Ажлын цаг', lines: 'Даваа – Баасан 09:00 – 18:00\nБямба – Ням 10:00 – 17:00', note: 'Тэмцээн, зохион байгуулалтын арга хэмжээний үед цагийн хуваарь өөрчлөгдөж болно.' },
        ],
      }),
      block('contact-form-map', {
        formTag: '02',
        formLabel: 'БИДЭНД ЗУРВАС ИЛГЭЭХ',
        formIntro: 'Доорх form-ыг бөглөж, бид тантай хамгийн хурдан хугацаанд холбогдох болно.',
        submitText: 'Илгээх',
        subjects: 'Сургалтын талаар\nГишүүнчлэлийн талаар\nТэмцээний талаар\nЕрөнхий мэдээлэл',
        mapTag: '03',
        mapLabel: 'МАНАЙ БАЙРШИЛ',
        mapIntro: 'Клубын байршил, чиглэлийн гарын авлагыг дороос харна уу.',
        pinTitle: 'Prime Practical Shooting Club',
        pinLines: 'Яармаг, Хан-Уул дүүрэг\nУлаанбаатар, Монгол Улс',
        mapBadge: 'KHAN-UUL DISTRICT',
        mapAddressBar: 'Хан-Уул дүүрэг, Яармаг, Спорт цогцолборын баруун, Улаанбаатар, Монгол Улс',
        mapLinkText: 'Google Map дээр нээх →',
        mapLinkHref: 'https://maps.google.com',
      }),
      block('contact-categories', {
        sectionNumber: '04',
        sectionLabel: 'ТҮГЭЭМЭЛ ЛАВЛАГАА',
        intro: 'Түгээмэл асуултуудыг дагуу хурдан холбогдох сувгаа сонгоно уу.',
        items: [
          { icon: 'GraduationCap', title: 'Сургалтын талаар', body: 'Сургалтын хөтөлбөр, хуваарь, бүртгэлтэй холбоотой асуулт', href: '/training' },
          { icon: 'Users', title: 'Гишүүнчлэлийн талаар', body: 'Гишүүн болох, гишүүний эрх болон хөнгөлөлт', href: '/membership' },
          { icon: 'Trophy', title: 'Тэмцээний талаар', body: 'Тэмцээний бүртгэл, хуваарь, дүрэм журам', href: '/ranking' },
          { icon: 'HelpCircle', title: 'Ерөнхий мэдээлэл', body: 'Хаяг, ажиллагаа, клубын мэдээлэл, бусад санал хүсэлт', href: '/about' },
        ],
      }),
      block('contact-social-cta', {
        eyebrow: 'PRIME PRACTICAL SHOOTING CLUB',
        title: 'ХАМТДАА ӨСӨН ХӨГЖЬЕ',
        description: 'Асуулт, санал эсвэл хамтын ажиллагааны санаатай бол бидэнтэй холбогдоно уу. Бид ургатаг нээлттэй.',
        followLabel: 'Бидний дагаарай',
        socials: [
          { label: 'FB', href: 'https://facebook.com' },
          { label: 'IG', href: 'https://instagram.com' },
          { label: 'YT', href: 'https://youtube.com' },
        ],
      }),
    ],
  },
  { slug: 'course-1', title: 'Course 1', metaTitle: 'Course 1 | PRIME', sortOrder: 7, blocks: [] },
  { slug: 'course-2', title: 'Course 2', metaTitle: 'Course 2 | PRIME', sortOrder: 8, blocks: [] },
  { slug: 'junior', title: 'Junior', metaTitle: 'Junior хөтөлбөр | PRIME', sortOrder: 9, blocks: [] },
  { slug: 'ranking-rules', title: 'Чансааны журам', metaTitle: 'Чансааны журам | PRIME', sortOrder: 10, blocks: [] },
];

module.exports = { DEFAULT_PAGES };
