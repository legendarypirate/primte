import { CUSTOM_TEMPLATE_SLUGS, getSitePage } from "@/lib/site-content";
import { SitePageView } from "./site-page-view";

/** Opt-in CMS rendering for routes not in CUSTOM_TEMPLATE_SLUGS. */
export async function CmsPageLoader({
  slug,
  fallback,
}: {
  slug: string;
  fallback: React.ReactNode;
}) {
  if (CUSTOM_TEMPLATE_SLUGS.has(slug)) return fallback;

  const page = await getSitePage(slug);
  if (page?.blocks?.length) return <SitePageView page={page} />;
  return fallback;
}
