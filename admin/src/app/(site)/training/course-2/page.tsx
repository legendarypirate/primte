import { Course2Page } from "@/components/site/pages/course-2-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export const metadata = {
  title: "Course 2 - Гишүүнчлэлийн анхан дунд шатны сургалт | PRIME IPSC Club",
  description: "IPSC Action Air Handgun анхан дунд шатны сургалтын дэлгэрэнгүй болон бүртгэл",
};

export default function Page() {
  return (
    <SitePageWithContent slug="course-2">
      <Course2Page />
    </SitePageWithContent>
  );
}
