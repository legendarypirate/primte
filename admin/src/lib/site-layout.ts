import { API } from "@/lib/api";
import type { FieldDef } from "@/lib/site-blocks";

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string };

export type SiteHeaderData = {
  logoUrl?: string;
  brandName?: string;
  brandBadge?: string;
  brandSubtitle?: string;
  navItems: NavItem[];
  ctaText: string;
  ctaHref: string;
  showSearch?: boolean;
};

export type SiteFooterData = {
  description: string;
  linksLabel: string;
  navItems: NavItem[];
  extraLinks?: NavItem[];
  contactLabel: string;
  phone: string;
  email: string;
  address: string;
  socialLabel: string;
  socials: SocialLink[];
  mottoLines: string[];
  copyright: string;
  badges: string[];
};

export type SiteLayoutData = {
  id?: string;
  header: SiteHeaderData;
  footer: SiteFooterData;
  updatedAt?: string;
};

export const DEFAULT_NAV: NavItem[] = [
  { label: "Нүүр", href: "/" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Сургалт", href: "/training" },
  { label: "Гишүүнчлэл", href: "/membership" },
  { label: "Тэмцээн", href: "/ranking" },
  { label: "Мэдээ", href: "/#news" },
  { label: "Холбоо барих", href: "/contact" },
];

export const DEFAULT_HEADER: SiteHeaderData = {
  logoUrl: "",
  brandName: "PRIME",
  brandBadge: "IPSC",
  brandSubtitle: "PRACTICAL SHOOTING CLUB",
  navItems: DEFAULT_NAV,
  ctaText: "БҮРТГҮҮЛЭХ",
  ctaHref: "/training",
  showSearch: true,
};

export const DEFAULT_FOOTER: SiteFooterData = {
  description:
    "Илүү сайн хүн, Илүү аюулгүй нийгэм.\nПрактик буудлагын спортоор дамжуулан сахилга бат, хариуцлага, манлайлыг төлөвшүүлнэ.",
  linksLabel: "ХОЛБООС",
  navItems: DEFAULT_NAV,
  extraLinks: [{ label: "Дэлгүүр", href: "/training#shop" }],
  contactLabel: "ХОЛБОО БАРИХ",
  phone: "8611-0200",
  email: "registration@prime.mn",
  address: "Улаанбаатар, Монгол Улс",
  socialLabel: "FOLLOW US",
  socials: [
    { label: "FB", href: "https://facebook.com" },
    { label: "IG", href: "https://instagram.com" },
    { label: "YT", href: "https://youtube.com" },
  ],
  mottoLines: ["DISCIPLINE", "SKILL", "A SAFER TOMORROW"],
  copyright: "© 2024 PRIME IPSC Club. Бүх эрх хуулиар хамгаалагдсан.",
  badges: ["IPSC ACTION AIR CLUB", "MONGOLIA"],
};

export const DEFAULT_LAYOUT: SiteLayoutData = {
  header: DEFAULT_HEADER,
  footer: DEFAULT_FOOTER,
};

const NAV_ITEM_FIELDS: FieldDef[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "href", label: "Link", type: "url" },
];

export const HEADER_FIELDS: FieldDef[] = [
  { key: "logoUrl", label: "Logo image", type: "image", fullWidth: true },
  { key: "brandName", label: "Brand name", type: "text" },
  { key: "brandBadge", label: "Brand badge", type: "text" },
  { key: "brandSubtitle", label: "Brand subtitle", type: "text", fullWidth: true },
  {
    key: "navItems",
    label: "Navigation links",
    type: "repeater",
    itemLabel: "Link",
    fields: NAV_ITEM_FIELDS,
  },
  { key: "ctaText", label: "CTA button text", type: "text" },
  { key: "ctaHref", label: "CTA button link", type: "url" },
  { key: "showSearch", label: "Show search button", type: "checkbox" },
];

export const FOOTER_FIELDS: FieldDef[] = [
  { key: "description", label: "Brand description", type: "textarea", fullWidth: true },
  { key: "linksLabel", label: "Links column label", type: "text" },
  {
    key: "navItems",
    label: "Navigation links",
    type: "repeater",
    itemLabel: "Link",
    fields: NAV_ITEM_FIELDS,
  },
  {
    key: "extraLinks",
    label: "Extra links",
    type: "repeater",
    itemLabel: "Link",
    fields: NAV_ITEM_FIELDS,
  },
  { key: "contactLabel", label: "Contact column label", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "address", label: "Address", type: "text", fullWidth: true },
  { key: "socialLabel", label: "Social column label", type: "text" },
  {
    key: "socials",
    label: "Social links",
    type: "repeater",
    itemLabel: "Social",
    fields: NAV_ITEM_FIELDS,
  },
  {
    key: "mottoLines",
    label: "Motto lines (one per row)",
    type: "textarea",
    fullWidth: true,
    placeholder: "DISCIPLINE\nSKILL",
  },
  { key: "copyright", label: "Copyright", type: "text", fullWidth: true },
  {
    key: "badges",
    label: "Bottom badges (one per row)",
    type: "textarea",
    fullWidth: true,
    placeholder: "IPSC ACTION AIR CLUB\nMONGOLIA",
  },
];

export function normalizeHeader(raw: Record<string, unknown> | undefined): SiteHeaderData {
  return {
    ...DEFAULT_HEADER,
    ...raw,
    navItems: Array.isArray(raw?.navItems) ? (raw.navItems as NavItem[]) : DEFAULT_NAV,
  };
}

export function normalizeFooter(raw: Record<string, unknown> | undefined): SiteFooterData {
  const mottoRaw = raw?.mottoLines;
  const badgesRaw = raw?.badges;
  return {
    ...DEFAULT_FOOTER,
    ...raw,
    navItems: Array.isArray(raw?.navItems) ? (raw.navItems as NavItem[]) : DEFAULT_NAV,
    extraLinks: Array.isArray(raw?.extraLinks) ? (raw.extraLinks as NavItem[]) : DEFAULT_FOOTER.extraLinks,
    socials: Array.isArray(raw?.socials) ? (raw.socials as SocialLink[]) : DEFAULT_FOOTER.socials,
    mottoLines: Array.isArray(mottoRaw)
      ? (mottoRaw as string[])
      : String(mottoRaw || DEFAULT_FOOTER.mottoLines.join("\n"))
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
    badges: Array.isArray(badgesRaw)
      ? (badgesRaw as string[])
      : String(badgesRaw || DEFAULT_FOOTER.badges.join("\n"))
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
  };
}

export function normalizeLayout(raw: Partial<SiteLayoutData> | null | undefined): SiteLayoutData {
  return {
    id: raw?.id,
    updatedAt: raw?.updatedAt,
    header: normalizeHeader(raw?.header as Record<string, unknown> | undefined),
    footer: normalizeFooter(raw?.footer as Record<string, unknown> | undefined),
  };
}

export async function getSiteLayout(): Promise<SiteLayoutData> {
  try {
    const res = await fetch(`${API}/api/site/layout`, { next: { revalidate: 30 } });
    if (!res.ok) return DEFAULT_LAYOUT;
    const data = await res.json();
    return normalizeLayout(data.layout);
  } catch {
    return DEFAULT_LAYOUT;
  }
}

export function layoutSnapshot(layout: SiteLayoutData | null) {
  if (!layout) return "";
  return JSON.stringify({ header: layout.header, footer: layout.footer });
}
