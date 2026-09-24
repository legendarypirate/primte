export const siteNav = [
  { href: "/", label: "Нүүр" },
  { href: "/about", label: "Бидний тухай" },
  { href: "/training", label: "Сургалт" },
  { href: "/membership", label: "Гишүүнчлэл" },
  { href: "/ranking", label: "Тэмцээн" },
  { href: "/#news", label: "Мэдээ" },
  { href: "/contact", label: "Холбоо барих" },
] as const;

export type SitePath = (typeof siteNav)[number]["href"];
