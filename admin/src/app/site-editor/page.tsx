"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Layers,
  RefreshCw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { EditableCanvas } from "@/components/site-editor/editable-canvas";
import { BlockInspector } from "@/components/site-editor/block-inspector";
import { AddBlockDialog } from "@/components/site-editor/add-block-dialog";
import { api } from "@/lib/api";
import type { SiteBlock, SitePageData } from "@/lib/site-blocks";
import { PAGE_SLUGS } from "@/lib/site-content";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function snapshot(page: SitePageData | null) {
  if (!page) return "";
  return JSON.stringify({
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    published: page.published,
    blocks: page.blocks,
  });
}

export default function SiteEditorPage() {
  const [pages, setPages] = useState<SitePageData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SitePageData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [inspectorBlockId, setInspectorBlockId] = useState<string | null>(null);
  const [addBlockOpen, setAddBlockOpen] = useState(false);
  const [addBlockIndex, setAddBlockIndex] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  const isDirty = useMemo(() => snapshot(draft) !== savedSnapshot, [draft, savedSnapshot]);
  const pageMeta = draft ? Object.values(PAGE_SLUGS).find((p) => p.slug === draft.slug) : null;
  const inspectorBlock = draft?.blocks.find((b) => b.id === inspectorBlockId) || null;

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ pages: SitePageData[] }>("/api/admin/site-pages");
      setPages(data.pages);
      if (initialLoad.current && data.pages.length) {
        setSelectedId(data.pages[0].id);
        initialLoad.current = false;
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (!selectedId) return;
    api<{ page: SitePageData }>(`/api/admin/site-pages/${selectedId}`)
      .then((d) => {
        setDraft(d.page);
        setSavedSnapshot(snapshot(d.page));
        setSelectedBlockId(null);
        setInspectorBlockId(null);
      })
      .catch((e) => toast.error(e.message));
  }, [selectedId]);

  const updateDraft = (patch: Partial<SitePageData>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const updateBlock = (blockId: string, patch: Partial<SiteBlock>) => {
    if (!draft) return;
    updateDraft({
      blocks: draft.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
    });
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    if (!draft) return;
    const next = [...draft.blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateDraft({ blocks: next });
  };

  const removeBlock = (blockId: string) => {
    if (!draft) return;
    if (!confirm("Энэ блокийг устгах уу?")) return;
    const next = draft.blocks.filter((b) => b.id !== blockId);
    updateDraft({ blocks: next });
    if (selectedBlockId === blockId) setSelectedBlockId(null);
    if (inspectorBlockId === blockId) setInspectorBlockId(null);
  };

  const duplicateBlock = (block: SiteBlock) => {
    if (!draft) return;
    const copy = { ...block, id: crypto.randomUUID(), data: JSON.parse(JSON.stringify(block.data)) };
    const index = draft.blocks.findIndex((b) => b.id === block.id);
    const next = [...draft.blocks];
    next.splice(index + 1, 0, copy);
    updateDraft({ blocks: next });
    setSelectedBlockId(copy.id);
  };

  const insertBlock = (block: SiteBlock) => {
    if (!draft) return;
    const next = [...draft.blocks];
    next.splice(addBlockIndex, 0, block);
    updateDraft({ blocks: next });
    setSelectedBlockId(block.id);
  };

  const publish = async () => {
    if (!draft) return;
    setPublishing(true);
    try {
      const data = await api<{ page: SitePageData }>(`/api/admin/site-pages/${draft.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: draft.title,
          metaTitle: draft.metaTitle,
          metaDescription: draft.metaDescription,
          published: true,
          blocks: draft.blocks,
        }),
      });
      setDraft({ ...data.page, published: true });
      setSavedSnapshot(snapshot({ ...data.page, published: true }));
      setPages((prev) => prev.map((p) => (p.id === data.page.id ? { ...p, ...data.page, published: true } : p)));
      toast.success("Нийтлэгдлээ!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Нийтлэхэд алдаа");
    } finally {
      setPublishing(false);
    }
  };

  const reseed = async () => {
    if (!confirm("Бүх хуудсыг анхны агуулгаар дахин үүсгэх үү?")) return;
    try {
      await api("/api/admin/site-pages/seed", { method: "POST" });
      toast.success("Анхны агуулга сэргээлээ");
      initialLoad.current = true;
      setSelectedId(null);
      await loadPages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  };

  const switchPage = (id: string) => {
    if (isDirty && !confirm("Хадгалаагүй өөрчлөлт байна. Шилжих үү?")) return;
    setSelectedId(id);
  };

  if (loading && !pages.length) {
    return <div className="flex min-h-screen items-center justify-center text-[#a0a0a5]">Уншиж байна...</div>;
  }

  return (
    <>
      {/* Top editor chrome */}
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
          ) : draft?.published ? (
            <Badge className="bg-green-600/20 text-green-400 text-[10px]">Нийтэлсэн</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-[#a0a0a5]">Ноорог</Badge>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button type="button" size="sm" variant="ghost" className="h-8 text-[#a0a0a5] hover:text-white" onClick={reseed}>
              <RefreshCw className="size-3.5" />
              Reset
            </Button>
            {pageMeta ? (
              <Link
                href={pageMeta.path}
                target="_blank"
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-[#a0a0a5] hover:bg-[#ffffff10] hover:text-white"
              >
                <ExternalLink className="size-3.5" />
                Live
              </Link>
            ) : null}
            <Button
              type="button"
              size="sm"
              className="h-8 bg-[#e31e24] px-4 hover:bg-[#c91920]"
              disabled={publishing || !draft}
              onClick={publish}
            >
              <Send className="size-3.5" />
              {publishing ? "Нийтэлж байна..." : "Нийтэх"}
            </Button>
          </div>
        </div>

        {/* Horizontal page tabs */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5">
          <span className="flex shrink-0 items-center gap-1.5 pr-2 text-[10px] font-bold uppercase tracking-widest text-[#a0a0a5]">
            <Layers className="size-3.5" />
            Хуудсууд
          </span>
          {pages.map((page) => {
            const active = selectedId === page.id;
            const meta = Object.values(PAGE_SLUGS).find((p) => p.slug === page.slug);
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => switchPage(page.id)}
                className={cn(
                  "flex shrink-0 flex-col rounded-lg border px-4 py-2 text-left transition-all",
                  active
                    ? "border-[#e31e24] bg-[#e31e24] text-white shadow-lg shadow-[#e31e24]/20"
                    : "border-[#ffffff15] bg-[#141416] text-white hover:border-[#e31e24]/40"
                )}
              >
                <span className="text-sm font-semibold whitespace-nowrap">{page.title}</span>
                <span className={cn("text-[10px] whitespace-nowrap", active ? "text-white/75" : "text-[#a0a0a5]")}>
                  {meta?.path || `/${page.slug}`} · {page.blockCount ?? page.blocks?.length ?? 0} блок
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Hint bar */}
      <div className="border-b border-[#ffffff08] bg-[#0a0a0c] px-4 py-2 text-center text-[11px] text-[#a0a0a5]">
        Текст дээр дарж шууд засна · Блок сонгоход хяналтын самбар гарна · <span className="text-[#e31e24]">⚙</span> дээр дарж link, meta засна
      </div>

      {/* WYSIWYG canvas — the page itself */}
      {draft ? (
        <EditableCanvas
          blocks={draft.blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onUpdateBlock={updateBlock}
          onMoveBlock={moveBlock}
          onDuplicateBlock={duplicateBlock}
          onRemoveBlock={removeBlock}
          onOpenInspector={setInspectorBlockId}
          onAddBlockAt={(index) => {
            setAddBlockIndex(index);
            setAddBlockOpen(true);
          }}
        />
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center text-[#a0a0a5]">Хуудас сонгоно уу</div>
      )}

      {inspectorBlock ? (
        <BlockInspector
          block={inspectorBlock}
          onClose={() => setInspectorBlockId(null)}
          onChange={(data) => updateBlock(inspectorBlock.id, { data })}
        />
      ) : null}

      <AddBlockDialog
        open={addBlockOpen}
        onOpenChange={setAddBlockOpen}
        onAdd={insertBlock}
      />
    </>
  );
}
