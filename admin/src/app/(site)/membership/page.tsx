import { MembershipPage } from "@/components/site/pages/membership-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export default function Membership() {
  return (
    <SitePageWithContent slug="membership">
      <MembershipPage />
    </SitePageWithContent>
  );
}
