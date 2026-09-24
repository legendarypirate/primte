import { CUSTOM_TEMPLATE_SLUGS, getSitePage } from "@/lib/site-content";
import { SitePageView } from "./site-page-view";

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
