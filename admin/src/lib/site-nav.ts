import { DEFAULT_NAV } from "@/lib/site-layout";

export const siteNav = DEFAULT_NAV;

export type SitePath = (typeof siteNav)[number]["href"];
