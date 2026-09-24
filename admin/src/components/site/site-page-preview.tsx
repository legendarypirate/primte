"use client";

import type { ComponentType } from "react";
import { AboutPage } from "@/components/site/pages/about-page";
import { ContactPage } from "@/components/site/pages/contact-page";
import { HomePage } from "@/components/site/pages/home-page";
import { MembershipPage } from "@/components/site/pages/membership-page";
import { RankingPage } from "@/components/site/pages/ranking-page";
import { TrainingPage } from "@/components/site/pages/training-page";
import type { PageContent } from "@/components/site/page-content-context";
import { PageContentProvider } from "@/components/site/page-content-context";
import { CUSTOM_TEMPLATE_SLUGS } from "@/lib/site-content";

const PAGES: Record<string, ComponentType> = {
  home: HomePage,
  about: AboutPage,
  training: TrainingPage,
  membership: MembershipPage,
  ranking: RankingPage,
  contact: ContactPage,
};

export function SitePagePreview({
  slug,
  content,
  editing = false,
  onContentChange,
}: {
  slug: string;
  content: PageContent;
  editing?: boolean;
  onContentChange?: (content: PageContent) => void;
}) {
  const Cmp = PAGES[slug];
  if (!Cmp) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-[#a0a0a5]">
        Unknown page: {slug}
      </div>
    );
  }

  return (
    <PageContentProvider content={content} editing={editing} onChange={onContentChange}>
      <Cmp />
    </PageContentProvider>
  );
}

export function isLivePagePreview(slug: string) {
  return CUSTOM_TEMPLATE_SLUGS.has(slug);
}
