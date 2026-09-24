import { AboutPage } from "@/components/site/pages/about-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export default function About() {
  return (
    <SitePageWithContent slug="about">
      <AboutPage />
    </SitePageWithContent>
  );
}
