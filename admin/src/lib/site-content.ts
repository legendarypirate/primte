import { API } from "@/lib/api";
import type { SitePageData } from "@/lib/site-blocks";

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

/** Public routes that use a dedicated React page instead of CMS blocks. */
export const CUSTOM_TEMPLATE_SLUGS = new Set<string>(["ranking"]);
