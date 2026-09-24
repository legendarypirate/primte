export type CompetitionRow = {
  date: string;
  name: string;
  level: string;
  division: string;
  result: string;
  points: string;
  change: number;
};

export type TopResult = {
  place: number;
  name: string;
  points: string;
  date: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type AthleteStat = {
  icon: "target" | "chart" | "trophy" | "calendar" | "season";
  label: string;
  value: string;
  sub?: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
};

export type AthleteProfile = {
  slug: string;
  name: string;
  avatar: string;
  rank: number;
  totalAthletes: number;
  rankChange: number;
  club: string;
  division: string;
  category: string;
  totalPoints: string;
  competitions: number;
  featured?: boolean;
  stats: AthleteStat[];
  chartPoints: ChartPoint[];
  recentCompetitions: CompetitionRow[];
  topResults: TopResult[];
};

const DEFAULT_COMPETITIONS: CompetitionRow[] = [
  { date: "2025.04.20", name: "Club Match #6", level: "Level I", division: "Open", result: "92.6%", points: "1,320", change: 2 },
  { date: "2025.04.13", name: "Club Match #5", level: "Level I", division: "Open", result: "90.1%", points: "1,298", change: 1 },
  { date: "2025.03.30", name: "IPSC Level II", level: "Level II", division: "Open", result: "88.4%", points: "1,276", change: 2 },
  { date: "2025.03.16", name: "Club Match #4", level: "Level I", division: "Open", result: "86.2%", points: "1,210", change: -1 },
  { date: "2025.03.02", name: "Club Match #3", level: "Level I", division: "Open", result: "85.0%", points: "1,188", change: 1 },
  { date: "2025.02.16", name: "Winter Challenge", level: "Level II", division: "Open", result: "84.1%", points: "1,142", change: 3 },
  { date: "2025.02.02", name: "Club Match #2", level: "Level I", division: "Open", result: "82.5%", points: "1,098", change: 0 },
  { date: "2025.01.19", name: "Club Match #1", level: "Level I", division: "Open", result: "80.3%", points: "1,042", change: 2 },
  { date: "2024.12.15", name: "End of Year Cup", level: "Level I", division: "Open", result: "78.8%", points: "998", change: 1 },
  { date: "2024.11.24", name: "Autumn Match", level: "Level I", division: "Open", result: "76.2%", points: "962", change: -1 },
];

const ATHLETES: AthleteProfile[] = [
  {
    slug: "o-anhbayar",
    name: "О.Анхбаяр",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    rank: 1,
    totalAthletes: 78,
    rankChange: 2,
    club: "PRIME Practical Shooting Club",
    division: "Open",
    category: "Overall",
    totalPoints: "1,320",
    competitions: 6,
    featured: true,
    stats: [
      { icon: "target", label: "Best 10 дундаж", value: "1,320", trend: "+2.4%", trendUp: true, sub: "Өмнөх улирлаас" },
      { icon: "chart", label: "Дундаж performance", value: "78.4", trend: "+6.3", trendUp: true, sub: "Өмнөх улирлаас" },
      { icon: "trophy", label: "Хамгийн өндөр үр дүн", value: "92.6%", sub: "Club Match #6 · 2025.04.20" },
      { icon: "calendar", label: "Сүүлд шинэчлэгдсэн", value: "2025.04.20", sub: "● 18:32", highlight: true },
      { icon: "season", label: "Идэвхтэй улирал", value: "2024 – 2025", sub: "● Идэвхтэй", highlight: true },
    ],
    chartPoints: [
      { label: "11/24", value: 962 },
      { label: "12/15", value: 998 },
      { label: "01/19", value: 1042 },
      { label: "02/02", value: 1098 },
      { label: "02/16", value: 1142 },
      { label: "03/02", value: 1188 },
      { label: "03/16", value: 1210 },
      { label: "03/30", value: 1276 },
      { label: "04/13", value: 1298 },
      { label: "04/20", value: 1320 },
    ],
    recentCompetitions: DEFAULT_COMPETITIONS,
    topResults: [
      { place: 1, name: "Club Match #6", points: "1,320", date: "2025.04.20" },
      { place: 2, name: "Club Match #5", points: "1,298", date: "2025.04.13" },
      { place: 3, name: "IPSC Level II", points: "1,276", date: "2025.03.30" },
      { place: 4, name: "Club Match #4", points: "1,210", date: "2025.03.16" },
      { place: 5, name: "Club Match #3", points: "1,188", date: "2025.03.02" },
    ],
  },
  {
    slug: "b-erdenebat",
    name: "Б.Эрдэнэбат",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    rank: 2,
    totalAthletes: 78,
    rankChange: 1,
    club: "PRIME Practical Shooting Club",
    division: "Production",
    category: "Overall",
    totalPoints: "1,245",
    competitions: 6,
    stats: [
      { icon: "target", label: "Best 10 дундаж", value: "1,245", trend: "+1.8%", trendUp: true },
      { icon: "chart", label: "Дундаж performance", value: "76.2", trend: "+4.1", trendUp: true },
      { icon: "trophy", label: "Хамгийн өндөр үр дүн", value: "89.4%", sub: "Club Match #5 · 2025.04.13" },
      { icon: "calendar", label: "Сүүлд шинэчлэгдсэн", value: "2025.04.20", sub: "● 18:32" },
      { icon: "season", label: "Идэвхтэй улирал", value: "2024 – 2025", sub: "● Идэвхтэй", highlight: true },
    ],
    chartPoints: [
      { label: "11/24", value: 920 },
      { label: "12/15", value: 960 },
      { label: "01/19", value: 990 },
      { label: "02/02", value: 1020 },
      { label: "02/16", value: 1060 },
      { label: "03/02", value: 1100 },
      { label: "03/16", value: 1140 },
      { label: "03/30", value: 1180 },
      { label: "04/13", value: 1220 },
      { label: "04/20", value: 1245 },
    ],
    recentCompetitions: DEFAULT_COMPETITIONS.map((c) => ({ ...c, division: "Production", points: "1,245", result: "88.2%" })),
    topResults: [
      { place: 1, name: "Club Match #5", points: "1,245", date: "2025.04.13" },
      { place: 2, name: "Club Match #6", points: "1,220", date: "2025.04.20" },
      { place: 3, name: "Winter Challenge", points: "1,180", date: "2025.02.16" },
      { place: 4, name: "Club Match #4", points: "1,150", date: "2025.03.16" },
      { place: 5, name: "Club Match #3", points: "1,120", date: "2025.03.02" },
    ],
  },
  {
    slug: "s-zolboo",
    name: "С.Золбоо",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    rank: 3,
    totalAthletes: 78,
    rankChange: -1,
    club: "PRIME Practical Shooting Club",
    division: "Production",
    category: "Overall",
    totalPoints: "1,190",
    competitions: 6,
    stats: [
      { icon: "target", label: "Best 10 дундаж", value: "1,190", trend: "-0.8%", trendUp: false },
      { icon: "chart", label: "Дундаж performance", value: "74.8", trend: "+2.1", trendUp: true },
      { icon: "trophy", label: "Хамгийн өндөр үр дүн", value: "87.1%", sub: "Club Match #4 · 2025.03.16" },
      { icon: "calendar", label: "Сүүлд шинэчлэгдсэн", value: "2025.04.20", sub: "● 18:32" },
      { icon: "season", label: "Идэвхтэй улирал", value: "2024 – 2025", sub: "● Идэвхтэй", highlight: true },
    ],
    chartPoints: [
      { label: "11/24", value: 900 },
      { label: "12/15", value: 930 },
      { label: "01/19", value: 960 },
      { label: "02/02", value: 1000 },
      { label: "02/16", value: 1040 },
      { label: "03/02", value: 1080 },
      { label: "03/16", value: 1120 },
      { label: "03/30", value: 1150 },
      { label: "04/13", value: 1180 },
      { label: "04/20", value: 1190 },
    ],
    recentCompetitions: DEFAULT_COMPETITIONS.map((c) => ({ ...c, division: "Production", points: "1,190", result: "85.6%" })),
    topResults: [
      { place: 1, name: "Club Match #4", points: "1,190", date: "2025.03.16" },
      { place: 2, name: "Club Match #6", points: "1,170", date: "2025.04.20" },
      { place: 3, name: "Club Match #3", points: "1,140", date: "2025.03.02" },
      { place: 4, name: "Winter Challenge", points: "1,100", date: "2025.02.16" },
      { place: 5, name: "Club Match #2", points: "1,080", date: "2025.02.02" },
    ],
  },
  {
    slug: "d-chinzorig",
    name: "Д.Чинзориг",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    rank: 4,
    totalAthletes: 78,
    rankChange: 3,
    club: "PRIME Practical Shooting Club",
    division: "Carry Optics",
    category: "Overall",
    totalPoints: "1,102",
    competitions: 5,
    stats: [
      { icon: "target", label: "Best 10 дундаж", value: "1,102", trend: "+3.2%", trendUp: true },
      { icon: "chart", label: "Дундаж performance", value: "72.1", trend: "+5.0", trendUp: true },
      { icon: "trophy", label: "Хамгийн өндөр үр дүн", value: "84.3%", sub: "Club Match #6 · 2025.04.20" },
      { icon: "calendar", label: "Сүүлд шинэчлэгдсэн", value: "2025.04.20", sub: "● 18:32" },
      { icon: "season", label: "Идэвхтэй улирал", value: "2024 – 2025", sub: "● Идэвхтэй", highlight: true },
    ],
    chartPoints: [
      { label: "11/24", value: 880 },
      { label: "12/15", value: 910 },
      { label: "01/19", value: 940 },
      { label: "02/02", value: 980 },
      { label: "02/16", value: 1010 },
      { label: "03/02", value: 1040 },
      { label: "03/16", value: 1060 },
      { label: "03/30", value: 1080 },
      { label: "04/13", value: 1095 },
      { label: "04/20", value: 1102 },
    ],
    recentCompetitions: DEFAULT_COMPETITIONS.slice(0, 8).map((c) => ({ ...c, division: "Carry Optics", points: "1,102" })),
    topResults: [
      { place: 1, name: "Club Match #6", points: "1,102", date: "2025.04.20" },
      { place: 2, name: "Club Match #5", points: "1,080", date: "2025.04.13" },
      { place: 3, name: "Club Match #4", points: "1,050", date: "2025.03.16" },
      { place: 4, name: "Club Match #3", points: "1,020", date: "2025.03.02" },
      { place: 5, name: "Winter Challenge", points: "990", date: "2025.02.16" },
    ],
  },
];

export function getAthleteBySlug(slug: string): AthleteProfile | undefined {
  return ATHLETES.find((a) => a.slug === slug);
}

export function getAllAthletes(): AthleteProfile[] {
  return ATHLETES;
}

/** Summary rows for ranking table / podium */
export function getRankingSummaries() {
  return ATHLETES.map((a) => ({
    slug: a.slug,
    rank: a.rank,
    name: a.name,
    division: a.division,
    category: a.category,
    comps: a.competitions,
    best10: a.totalPoints,
    total: a.totalPoints,
    change: a.rankChange,
    avatar: a.avatar,
    featured: a.featured,
    score: a.totalPoints,
    divisionLabel: `${a.division} / ${a.category}`,
    changeLabel: a.rankChange >= 0 ? `+${a.rankChange}` : String(a.rankChange),
  })).sort((a, b) => a.rank - b.rank);
}

export function getPodiumOrder() {
  const summaries = getRankingSummaries();
  const order = [2, 1, 3];
  return order.map((r) => summaries.find((s) => s.rank === r)).filter(Boolean) as ReturnType<typeof getRankingSummaries>;
}
