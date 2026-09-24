import { ContactPage } from "@/components/site/pages/contact-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export default function Contact() {
  return (
    <SitePageWithContent slug="contact">
      <ContactPage />
    </SitePageWithContent>
  );
}
