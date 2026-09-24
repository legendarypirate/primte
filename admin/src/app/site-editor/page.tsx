"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Layers,
  LayoutTemplate,
  RefreshCw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/shell";
import { LayoutInspector } from "@/components/site-editor/layout-inspector";
import { SitePagePreview, isLivePagePreview } from "@/components/site/site-page-preview";
import { SitePreviewGuard } from "@/components/site/site-preview-guard";
import type { PageContent } from "@/components/site/page-content-context";
import { api } from "@/lib/api";
import type { SitePageData } from "@/lib/site-blocks";
import { PAGE_SLUGS } from "@/lib/site-content";
import {
  layoutSnapshot,
  normalizeLayout,
  type SiteLayoutData,
} from "@/lib/site-layout";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ViewMode = "page" | "layout";

function contentSnapshot(content: PageContent) {
  return JSON.stringify(content);
}

export default function SiteEditorPage() {
  const [pages, setPages] = useState<SitePageData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("page");
  const [selectedSlug, setSelectedSlug] = useState<string>("home");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pageContentDraft, setPageContentDraft] = useState<PageContent>({});
  const [savedPageContentSnapshot, setSavedPageContentSnapshot] = useState("{}");
  const [layoutDraft, setLayoutDraft] = useState<SiteLayoutData | null>(null);
  const [savedLayoutSnapshot, setSavedLayoutSnapshot] = useState("");
  const [layoutInspector, setLayoutInspector] = useState<"header" | "footer" | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  const layoutDirty = useMemo(
    () => layoutSnapshot(layoutDraft) !== savedLayoutSnapshot,
    [layoutDraft, savedLayoutSnapshot]
  );
  const pageContentDirty = useMemo(
    () => contentSnapshot(pageContentDraft) !== savedPageContentSnapshot,
    [pageContentDraft, savedPageContentSnapshot]
  );
  const isDirty = layoutDirty || pageContentDirty;
  const pageMeta = Object.values(PAGE_SLUGS).find((p) => p.slug === selectedSlug) ?? null;

  const loadEditor = useCallback(async () => {
    setLoading(true);
    try {
      const [pagesData, layoutData] = await Promise.all([
        api<{ pages: SitePageData[] }>("/api/admin/site-pages"),
        api<{ layout: SiteLayoutData }>("/api/admin/site-layout"),
      ]);
      setPages(pagesData.pages);
      const layout = normalizeLayout(layoutData.layout);
      setLayoutDraft(layout);
      setSavedLayoutSnapshot(layoutSnapshot(layout));
      if (initialLoad.current && pagesData.pages.length) {
        const first = pagesData.pages.find((p) => p.slug === "home") ?? pagesData.pages[0];
        setSelectedSlug(first.slug);
        setSelectedPageId(first.id);
        initialLoad.current = false;
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEditor();
  }, [loadEditor]);

  useEffect(() => {
    if (!selectedPageId || viewMode !== "page") return;
    api<{ page: SitePageData }>(`/api/admin/site-pages/${selectedPageId}`)
      .then((d) => {
        const content = (d.page.content as PageContent) || {};
        setPageContentDraft(content);
        setSavedPageContentSnapshot(contentSnapshot(content));
      })
      .catch((e) => toast.error(e.message));
  }, [selectedPageId, viewMode]);

  const publish = async () => {
    if (!isDirty) return;
    setPublishing(true);
    try {
      if (layoutDirty && layoutDraft) {
        const layoutRes = await api<{ layout: SiteLayoutData }>("/api/admin/site-layout", {
          method: "PUT",
          body: JSON.stringify({
            header: layoutDraft.header,
            footer: layoutDraft.footer,
          }),
        });
        const layout = normalizeLayout(layoutRes.layout);
        setLayoutDraft(layout);
        setSavedLayoutSnapshot(layoutSnapshot(layout));
      }

      if (pageContentDirty && selectedPageId) {
        const pageRes = await api<{ page: SitePageData }>(`/api/admin/site-pages/${selectedPageId}`, {
          method: "PUT",
          body: JSON.stringify({ content: pageContentDraft, published: true }),
        });
        const content = (pageRes.page.content as PageContent) || {};
        setPageContentDraft(content);
        setSavedPageContentSnapshot(contentSnapshot(content));
      }

      toast.success("Нийтлэгдлээ!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Нийтлэхэд алдаа");
    } finally {
      setPublishing(false);
    }
  };

  const resetLayout = async () => {
    if (!confirm("Header болон footer-ийг анхны агуулгаар сэргээх үү?")) return;
    try {
      const data = await api<{ layout: SiteLayoutData }>("/api/admin/site-layout/reset", { method: "POST" });
      const layout = normalizeLayout(data.layout);
      setLayoutDraft(layout);
      setSavedLayoutSnapshot(layoutSnapshot(layout));
      toast.success("Layout сэргээлээ");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  };

  const confirmDiscard = () => !isDirty || confirm("Хадгалаагүй өөрчлөлт байна. Шилжих үү?");

  const switchPage = (slug: string, pageId: string) => {
    if (!confirmDiscard()) return;
    setViewMode("page");
    setLayoutInspector(null);
    setSelectedSlug(slug);
    setSelectedPageId(pageId);
  };

  const switchLayout = () => {
    if (!confirmDiscard()) return;
    setViewMode("layout");
    setLayoutInspector(null);
  };

  if (loading && !pages.length && !layoutDraft) {
    return <div className="flex min-h-screen items-center justify-center text-[#a0a0a5]">Уншиж байна...</div>;
  }

  const layoutEdit = layoutDraft
    ? {
        onHeaderChange: (header: SiteLayoutData["header"]) =>
          setLayoutDraft((prev) => (prev ? { ...prev, header } : prev)),
        onFooterChange: (footer: SiteLayoutData["footer"]) =>
          setLayoutDraft((prev) => (prev ? { ...prev, footer } : prev)),
        onOpenHeaderSettings: () => setLayoutInspector("header"),
        onOpenFooterSettings: () => setLayoutInspector("footer"),
      }
    : undefined;

  const pageTabs = pages.length
    ? pages.filter((p) => isLivePagePreview(p.slug))
    : Object.values(PAGE_SLUGS).map((p, i) => ({
        id: p.slug,
        slug: p.slug,
        title: p.label,
        sortOrder: i,
      }));

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-[#ffffff15] bg-[#0e0e10]/95 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-[#ffffff10] px-4 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#a0a0a5] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            Admin
          </Link>
          <span className="text-[#ffffff20]">|</span>
          <Globe className="size-4 text-[#e31e24]" />
          <span className="font-heading text-sm font-semibold tracking-wider text-white">PRIME SITE EDITOR</span>
          {isDirty ? (
            <Badge variant="outline" className="border-[#e31e24]/50 text-[#e31e24] text-[10px]">
              Хадгалаагүй
            </Badge>
          ) : (
            <Badge className="bg-green-600/20 text-green-400 text-[10px]">Нийтэлсэн</Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 text-[#a0a0a5] hover:text-white"
              onClick={resetLayout}
            >
              <RefreshCw className="size-3.5" />
              Reset layout
            </Button>
            <Link
              href={viewMode === "layout" ? "/" : pageMeta?.path || "/"}
              target="_blank"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-[#a0a0a5] hover:bg-[#ffffff10] hover:text-white"
            >
              <ExternalLink className="size-3.5" />
              Live
            </Link>
            <Button
              type="button"
              size="sm"
              className="h-8 bg-[#e31e24] px-4 hover:bg-[#c91920]"
              disabled={publishing || !isDirty}
              onClick={publish}
            >
              <Send className="size-3.5" />
              {publishing ? "Нийтэлж байна..." : "Нийтэх"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5">
          <span className="flex shrink-0 items-center gap-1.5 pr-2 text-[10px] font-bold uppercase tracking-widest text-[#a0a0a5]">
            <Layers className="size-3.5" />
            Засвар
          </span>
          <button
            type="button"
            onClick={switchLayout}
            className={cn(
              "flex shrink-0 flex-col rounded-lg border px-4 py-2 text-left transition-all",
              viewMode === "layout"
                ? "border-[#e31e24] bg-[#e31e24] text-white shadow-lg shadow-[#e31e24]/20"
                : "border-[#ffffff15] bg-[#141416] text-white hover:border-[#e31e24]/40"
            )}
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap">
              <LayoutTemplate className="size-3.5" />
              Header & Footer
            </span>
            <span className={cn("text-[10px] whitespace-nowrap", viewMode === "layout" ? "text-white/75" : "text-[#a0a0a5]")}>
              Navbar · Footer · Logo
            </span>
          </button>
          {pageTabs.map((page) => {
            const active = viewMode === "page" && selectedSlug === page.slug;
            const meta = Object.values(PAGE_SLUGS).find((p) => p.slug === page.slug);
            return (
              <button
                key={page.slug}
                type="button"
                onClick={() => switchPage(page.slug, page.id)}
                className={cn(
                  "flex shrink-0 flex-col rounded-lg border px-4 py-2 text-left transition-all",
                  active
                    ? "border-[#e31e24] bg-[#e31e24] text-white shadow-lg shadow-[#e31e24]/20"
                    : "border-[#ffffff15] bg-[#141416] text-white hover:border-[#e31e24]/40"
                )}
              >
                <span className="text-sm font-semibold whitespace-nowrap">{page.title}</span>
                <span className={cn("text-[10px] whitespace-nowrap", active ? "text-white/75" : "text-[#a0a0a5]")}>
                  {meta?.path || `/${page.slug}`} · Засварлах
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="border-b border-[#ffffff08] bg-[#0a0a0c] px-4 py-2 text-center text-[11px] text-[#a0a0a5]">
        {viewMode === "layout" ? (
          <>
            Header/Footer текст дээр дарж засна · <span className="text-[#e31e24]">Тохиргоо</span> дээр nav link, social засна
          </>
        ) : (
          <>
            Улаан хүрээтэй текст дээр дарж засна · Header/Footer мөн засагдана ·{" "}
            <span className="text-[#e31e24]">Нийтэх</span> дарахад хадгалагдана
          </>
        )}
      </div>

      {layoutDraft ? (
        <SitePreviewGuard>
          <SiteShell layout={layoutDraft} edit={layoutEdit}>
            {viewMode === "layout" ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-16 text-center">
                <LayoutTemplate className="size-10 text-[#e31e24]/50" />
                <p className="max-w-md text-sm text-[#a0a0a5]">
                  Header болон footer дээр шууд засвар хийнэ. Nav link, social хаяг, logo-г{" "}
                  <span className="text-[#e31e24]">Тохиргоо</span> товчоор нээнэ.
                </p>
              </div>
            ) : (
              <SitePagePreview
                slug={selectedSlug}
                content={pageContentDraft}
                editing
                onContentChange={setPageContentDraft}
              />
            )}
          </SiteShell>
        </SitePreviewGuard>
      ) : null}

      {layoutInspector && layoutDraft ? (
        <LayoutInspector
          section={layoutInspector}
          header={layoutDraft.header}
          footer={layoutDraft.footer}
          onHeaderChange={(header) => setLayoutDraft((prev) => (prev ? { ...prev, header } : prev))}
          onFooterChange={(footer) => setLayoutDraft((prev) => (prev ? { ...prev, footer } : prev))}
          onClose={() => setLayoutInspector(null)}
        />
      ) : null}
    </>
  );
}
