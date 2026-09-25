"use client";

import type { ComponentType } from "react";
import { AboutPage } from "@/components/site/pages/about-page";
import { ContactPage } from "@/components/site/pages/contact-page";
import { Course1Page } from "@/components/site/pages/course-1-page";
import { Course2Page } from "@/components/site/pages/course-2-page";
import { HomePage } from "@/components/site/pages/home-page";
import { JuniorPage } from "@/components/site/pages/junior-page";
import { MembershipPage } from "@/components/site/pages/membership-page";
import { RankingPage } from "@/components/site/pages/ranking-page";
import { RankingRulesPage } from "@/components/site/pages/ranking-rules-page";
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
  "course-1": Course1Page,
  "course-2": Course2Page,
  junior: JuniorPage,
  "ranking-rules": RankingRulesPage,
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
