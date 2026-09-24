import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { HomePage } from "@/components/site/pages/home-page";

export default function Home() {
  return <CmsPageLoader slug="home" fallback={<HomePage />} />;
}
