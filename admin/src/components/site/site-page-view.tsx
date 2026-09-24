"use client";

import type { SitePageData } from "@/lib/site-blocks";
import { SitePageRenderer } from "./block-renderer";

export function SitePageView({ page }: { page: SitePageData }) {
  return <SitePageRenderer blocks={page.blocks || []} />;
}
