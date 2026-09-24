import { PageContentProvider } from "@/components/site/page-content-context";
import { getPageContent } from "@/lib/site-content";

export async function SitePageWithContent({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const content = await getPageContent(slug);
  return <PageContentProvider content={content}>{children}</PageContentProvider>;
}
