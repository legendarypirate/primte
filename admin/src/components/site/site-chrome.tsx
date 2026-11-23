"use client";

import { usePathname } from "next/navigation";
import type { SiteLayoutData } from "@/lib/site-layout";
import { PrimeShell } from "./prime/prime-shell";
import { SiteShell } from "./shell";

export function SiteChrome({
  layout,
  children,
}: {
  layout: SiteLayoutData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/") {
    return <PrimeShell>{children}</PrimeShell>;
  }
  return <SiteShell layout={layout}>{children}</SiteShell>;
}
