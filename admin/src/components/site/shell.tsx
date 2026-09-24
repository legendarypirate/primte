import { SiteFooter } from "./footer";
import { SiteHeader } from "./header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070707] text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
