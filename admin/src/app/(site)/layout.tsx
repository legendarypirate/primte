import { SiteChrome } from "@/components/site/site-chrome";
import { getSiteLayout } from "@/lib/site-layout";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const layout = await getSiteLayout();
  return <SiteChrome layout={layout}>{children}</SiteChrome>;
}
