import type { Metadata } from "next";
import { HomePage } from "@/components/site/pages/home-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export const metadata: Metadata = {
  title: "Prime — Практик буудлагын спортын клуб",
  description:
    "Prime Practical Shooting Club: IPSC Action Air Mongolia. Туршилтын буудлага, гишүүнчлэлийн сургалт (Course 1, 2), жуниор хөтөлбөр, клубын тэмцээн.",
};

export default function Home() {
  return (
    <SitePageWithContent slug="home">
      <HomePage />
    </SitePageWithContent>
  );
}
