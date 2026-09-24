import { CmsPageLoader } from "@/components/site/cms-page-loader";
import { MembershipPage } from "@/components/site/pages/membership-page";

export default function Membership() {
  return <CmsPageLoader slug="membership" fallback={<MembershipPage />} />;
}
