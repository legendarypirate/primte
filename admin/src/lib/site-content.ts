import { API } from "@/lib/api";
import type { SitePageData } from "@/lib/site-blocks";

export async function getPageContent(slug: string): Promise<Record<string, string>> {
  const page = await getSitePage(slug);
  return (page?.content as Record<string, string>) || {};
}

export async function getSitePage(slug: string): Promise<SitePageData | null> {
  try {
    const res = await fetch(`${API}/api/site/pages/${slug}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page as SitePageData;
  } catch {
    return null;
  }
}

export const PAGE_SLUGS: Record<string, { slug: string; path: string; label: string }> = {
  home: { slug: "home", path: "/", label: "Нүүр" },
  about: { slug: "about", path: "/about", label: "Бидний тухай" },
  training: { slug: "training", path: "/training", label: "Сургалт" },
  membership: { slug: "membership", path: "/membership", label: "Гишүүнчлэл" },
  ranking: { slug: "ranking", path: "/ranking", label: "Ranking" },
  contact: { slug: "contact", path: "/contact", label: "Холбоо барих" },
};

/**
 * Live site routes that render dedicated React page components.
 * CMS blocks in the site editor are preview/seed data until full block parity exists.
 */
export const CUSTOM_TEMPLATE_SLUGS = new Set<string>([
  "home",
  "about",
  "training",
  "membership",
  "ranking",
  "contact",
]);
