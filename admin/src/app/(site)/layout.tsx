import { SiteShell } from "@/components/site/shell";
import { getSiteLayout } from "@/lib/site-layout";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const layout = await getSiteLayout();
  return <SiteShell layout={layout}>{children}</SiteShell>;
}
