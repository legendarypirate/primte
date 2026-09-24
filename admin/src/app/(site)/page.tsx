import { HomePage } from "@/components/site/pages/home-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export default function Home() {
  return (
    <SitePageWithContent slug="home">
      <HomePage />
    </SitePageWithContent>
  );
}
