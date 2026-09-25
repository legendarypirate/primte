"use client";

import { usePageContent } from "@/components/site/page-content-context";
import {
  CONTACT_PAGE_DEFAULTS,
  ContactCardsSection,
  ContactCategoriesSection,
  ContactFormMapSection,
  ContactHeroSection,
  ContactSocialCtaSection,
} from "../contact-sections";

type SectionKey = keyof typeof CONTACT_PAGE_DEFAULTS;

function useSection(key: SectionKey) {
  const ctx = usePageContent();
  const defaults = CONTACT_PAGE_DEFAULTS[key] as Record<string, unknown>;
  const field = `contact.${key}`;
  let data = defaults;
  const raw = ctx?.getField(field, "");
  if (raw) {
    try {
      data = { ...defaults, ...(JSON.parse(raw) as Record<string, unknown>) };
    } catch {
      data = defaults;
    }
  }
  const edit = ctx?.editing
    ? { onChange: (next: Record<string, unknown>) => ctx.setField(field, JSON.stringify(next)) }
    : undefined;
  return { data, edit };
}

export function ContactPage() {
  const hero = useSection("hero");
  const cards = useSection("cards");
  const formMap = useSection("formMap");
  const categories = useSection("categories");
  const socialCta = useSection("socialCta");
  return (
    <>
      <ContactHeroSection {...hero} />
      <ContactCardsSection {...cards} />
      <ContactFormMapSection {...formMap} />
      <ContactCategoriesSection {...categories} />
      <ContactSocialCtaSection {...socialCta} />
    </>
  );
}
