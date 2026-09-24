import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { AboutPage } from "@/components/site/pages/about-page";

export default function About() {
  return <CmsPageLoader slug="about" fallback={<AboutPage />} />;
}
