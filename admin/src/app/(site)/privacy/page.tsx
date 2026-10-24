import type { Metadata } from "next";
import { PrivacyPage } from "@/components/site/pages/privacy-page";
import { SitePageWithContent } from "@/components/site/site-page-with-content";

export const metadata: Metadata = {
  title: "Нууцлалын бодлого | Prime Club",
  description:
    "Prime Club (PRIME Practical Shooting Club) — вэб сайт, гишүүний апп болон клубын үйл ажиллагааны нууцлалын бодлого.",
};

export default function Privacy() {
  return (
    <SitePageWithContent slug="privacy">
      <PrivacyPage />
    </SitePageWithContent>
  );
}
