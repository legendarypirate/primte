"use client";

import {
  CONTACT_PAGE_DEFAULTS,
  ContactCardsSection,
  ContactCategoriesSection,
  ContactFormMapSection,
  ContactHeroSection,
  ContactSocialCtaSection,
} from "../contact-sections";

export function ContactPage() {
  return (
    <>
      <ContactHeroSection data={CONTACT_PAGE_DEFAULTS.hero} />
      <ContactCardsSection data={CONTACT_PAGE_DEFAULTS.cards} />
      <ContactFormMapSection data={CONTACT_PAGE_DEFAULTS.formMap} />
      <ContactCategoriesSection data={CONTACT_PAGE_DEFAULTS.categories} />
      <ContactSocialCtaSection data={CONTACT_PAGE_DEFAULTS.socialCta} />
    </>
  );
}
