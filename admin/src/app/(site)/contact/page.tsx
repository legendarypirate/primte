import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { ContactPage } from "@/components/site/pages/contact-page";

export default function Contact() {
  return <CmsPageLoader slug="contact" fallback={<ContactPage />} />;
}
