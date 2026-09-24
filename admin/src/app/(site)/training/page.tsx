import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { TrainingPage } from "@/components/site/pages/training-page";

export default function Training() {
  return <CmsPageLoader slug="training" fallback={<TrainingPage />} />;
}
