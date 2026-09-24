"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, Settings2 } from "lucide-react";
import type { SiteFooterData } from "@/lib/site-layout";
import { DEFAULT_FOOTER } from "@/lib/site-layout";
import { assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { InlineEdit } from "@/components/site-editor/inline-edit";
import { PrimeLogo } from "./primitives";

type EditCtx = {
  onChange: (footer: SiteFooterData) => void;
  onOpenSettings?: () => void;
  headerLogoUrl?: string;
  headerBrand?: { brandName?: string; brandBadge?: string; brandSubtitle?: string };
};

function patchFooter(f: SiteFooterData, key: keyof SiteFooterData, value: unknown): SiteFooterData {
  return { ...f, [key]: value };
}

function patchSocial(f: SiteFooterData, index: number, patch: Record<string, string>) {
  const socials = [...(f.socials || [])];
  socials[index] = { ...socials[index], ...patch };
  return patchFooter(f, "socials", socials);
}

export function SiteFooter({
  footer = DEFAULT_FOOTER,
  headerLogoUrl,
  headerBrand,
  edit,
}: {
  footer?: SiteFooterData;
  headerLogoUrl?: string;
  headerBrand?: { brandName?: string; brandBadge?: string; brandSubtitle?: string };
  edit?: EditCtx;
}) {
  const navItems = footer.navItems?.length ? footer.navItems : DEFAULT_FOOTER.navItems;
  const extraLinks = footer.extraLinks || [];
  const socials = footer.socials?.length ? footer.socials : DEFAULT_FOOTER.socials;
  const mottoLines = footer.mottoLines?.length ? footer.mottoLines : DEFAULT_FOOTER.mottoLines;
  const badges = footer.badges?.length ? footer.badges : DEFAULT_FOOTER.badges;
  const logoSrc = headerLogoUrl ? assetUrl(headerLogoUrl) : "";

  return (
    <footer className={cn("border-t border-[#ffffff15] bg-[#050507] pt-14 pb-8 text-[#a0a0a5]", edit && "ring-1 ring-inset ring-[#e31e24]/20")}>
      {edit ? (
        <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between px-4 md:px-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e31e24]">Footer</span>
          {edit.onOpenSettings ? (
            <button
              type="button"
              onClick={edit.onOpenSettings}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#a0a0a5] hover:bg-[#ffffff10] hover:text-white"
            >
              <Settings2 className="size-3" />
              Тохиргоо
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <PrimeLogo
              logoUrl={logoSrc}
              brandName={headerBrand?.brandName}
              brandBadge={headerBrand?.brandBadge}
              brandSubtitle={headerBrand?.brandSubtitle}
            />
            {edit ? (
              <InlineEdit
                value={footer.description || ""}
                onChange={(v) => edit.onChange(patchFooter(footer, "description", v))}
                multiline
                className="mt-4 text-xs leading-relaxed text-[#8a8a90]"
              />
            ) : (
              <p className="mt-4 whitespace-pre-line text-xs leading-relaxed text-[#8a8a90]">{footer.description}</p>
            )}
          </div>

          <div>
            {edit ? (
              <InlineEdit
                value={footer.linksLabel || ""}
                onChange={(v) => edit.onChange(patchFooter(footer, "linksLabel", v))}
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24] block"
              />
            ) : (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">{footer.linksLabel}</p>
            )}
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {navItems.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              {extraLinks.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {edit ? (
              <InlineEdit
                value={footer.contactLabel || ""}
                onChange={(v) => edit.onChange(patchFooter(footer, "contactLabel", v))}
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24] block"
              />
            ) : (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">{footer.contactLabel}</p>
            )}
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-[#e31e24]" />
                {edit ? (
                  <InlineEdit
                    value={footer.phone || ""}
                    onChange={(v) => edit.onChange(patchFooter(footer, "phone", v))}
                    className="flex-1"
                  />
                ) : (
                  <span>{footer.phone}</span>
                )}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-[#e31e24]" />
                {edit ? (
                  <InlineEdit
                    value={footer.email || ""}
                    onChange={(v) => edit.onChange(patchFooter(footer, "email", v))}
                    className="flex-1"
                  />
                ) : (
                  <span>{footer.email}</span>
                )}
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 text-[#e31e24]" />
                {edit ? (
                  <InlineEdit
                    value={footer.address || ""}
                    onChange={(v) => edit.onChange(patchFooter(footer, "address", v))}
                    className="flex-1"
                  />
                ) : (
                  <span>{footer.address}</span>
                )}
              </li>
            </ul>
          </div>

          <div>
            {edit ? (
              <InlineEdit
                value={footer.socialLabel || ""}
                onChange={(v) => edit.onChange(patchFooter(footer, "socialLabel", v))}
                className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24] block"
              />
            ) : (
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#e31e24]">{footer.socialLabel}</p>
            )}
            <div className="mb-6 flex gap-3 text-[10px] font-bold">
              {socials.map((s, i) =>
                edit ? (
                  <span
                    key={i}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5]"
                  >
                    <InlineEdit
                      value={s.label}
                      onChange={(v) => edit.onChange(patchSocial(footer, i, { label: v }))}
                      className="text-[10px]"
                    />
                  </span>
                ) : (
                  <a
                    key={i}
                    href={s.href || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white"
                  >
                    {s.label}
                  </a>
                )
              )}
            </div>
            <div className="space-y-0.5 font-mono text-[9px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">
              {edit ? (
                <InlineEdit
                  value={mottoLines.join("\n")}
                  onChange={(v) =>
                    edit.onChange(
                      patchFooter(
                        footer,
                        "mottoLines",
                        v
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    )
                  }
                  multiline
                  className="text-[9px]"
                />
              ) : (
                mottoLines.map((line) => <p key={line}>{line}</p>)
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#ffffff10] pt-6 text-[11px] text-muted-foreground sm:flex-row">
          {edit ? (
            <InlineEdit
              value={footer.copyright || ""}
              onChange={(v) => edit.onChange(patchFooter(footer, "copyright", v))}
              className="text-[11px] text-muted-foreground"
            />
          ) : (
            <p>{footer.copyright}</p>
          )}
          <div className="flex items-center gap-4 text-[10px] font-semibold tracking-widest uppercase">
            {edit ? (
              <InlineEdit
                value={badges.join("\n")}
                onChange={(v) =>
                  edit.onChange(
                    patchFooter(
                      footer,
                      "badges",
                      v
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  )
                }
                multiline
                className="text-[10px] text-right"
              />
            ) : (
              badges.map((badge, i) => (
                <span key={badge} className="flex items-center gap-4">
                  {i > 0 ? <span>/</span> : null}
                  <span>{badge}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
