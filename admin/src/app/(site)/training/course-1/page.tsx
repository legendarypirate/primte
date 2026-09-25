import { Course1Page } from "@/components/site/pages/course-1-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export const metadata = {
  title: "Course 1 - Гишүүнчлэлийн анхан шатны сургалт | PRIME IPSC Club",
  description: "IPSC Action Air Handgun анхан шатны сургалтын дэлгэрэнгүй болон бүртгэл",
};

export default function Page() {
  return (
    <SitePageWithContent slug="course-1">
      <Course1Page />
    </SitePageWithContent>
  );
}
