import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { RankingPage } from "@/components/site/pages/ranking-page";

export default function Ranking() {
  return <CmsPageLoader slug="ranking" fallback={<RankingPage />} />;
}
