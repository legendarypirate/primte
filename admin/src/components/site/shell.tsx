import type { SiteLayoutData } from "@/lib/site-layout";
import { DEFAULT_LAYOUT } from "@/lib/site-layout";
import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

type LayoutEdit = {
  onHeaderChange: (header: SiteLayoutData["header"]) => void;
  onFooterChange: (footer: SiteLayoutData["footer"]) => void;
  onOpenHeaderSettings?: () => void;
  onOpenFooterSettings?: () => void;
};

export function SiteShell({
  layout = DEFAULT_LAYOUT,
  children,
  edit,
}: {
  layout?: SiteLayoutData;
  children: React.ReactNode;
  edit?: LayoutEdit;
}) {
  return (
    <div className="min-h-screen bg-[#070707] text-foreground">
      <SiteHeader
        header={layout.header}
        edit={
          edit
            ? {
                onChange: edit.onHeaderChange,
                onOpenSettings: edit.onOpenHeaderSettings,
              }
            : undefined
        }
      />
      <main>{children}</main>
      <SiteFooter
        footer={layout.footer}
        headerLogoUrl={layout.header.logoUrl}
        headerBrand={{
          brandName: layout.header.brandName,
          brandBadge: layout.header.brandBadge,
          brandSubtitle: layout.header.brandSubtitle,
        }}
        edit={
          edit
            ? {
                onChange: edit.onFooterChange,
                onOpenSettings: edit.onOpenFooterSettings,
              }
            : undefined
        }
      />
    </div>
  );
}
