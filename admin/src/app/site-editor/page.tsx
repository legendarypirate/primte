"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  Eye,
  Layers,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { BlockFieldEditor } from "@/components/site-editor/field-editor";
import { SitePageRenderer } from "@/components/site/block-renderer";
import { api } from "@/lib/api";
import { BLOCK_SCHEMAS, BLOCK_SCHEMA_MAP, newBlock, type SiteBlock, type SitePageData } from "@/lib/site-blocks";
import { PAGE_SLUGS } from "@/lib/site-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SiteEditorPage() {
  const [pages, setPages] = useState<SitePageData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<SitePageData | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ pages: SitePageData[] }>("/api/admin/site-pages");
      setPages(data.pages);
      if (!selectedId && data.pages.length) {
        setSelectedId(data.pages[0].id);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  useEffect(() => {
    if (!selectedId) return;
    api<{ page: SitePageData }>(`/api/admin/site-pages/${selectedId}`)
      .then((d) => {
        setDraft(d.page);
        setSelectedBlockId(d.page.blocks[0]?.id || null);
      })
      .catch((e) => toast.error(e.message));
  }, [selectedId]);

  const selectedBlock = draft?.blocks.find((b) => b.id === selectedBlockId) || null;
  const pageMeta = draft ? Object.values(PAGE_SLUGS).find((p) => p.slug === draft.slug) : null;

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
    const next = draft.blocks.filter((b) => b.id !== blockId);
    updateDraft({ blocks: next });
    if (selectedBlockId === blockId) setSelectedBlockId(next[0]?.id || null);
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

  const addBlock = (type: string) => {
    if (!draft) return;
    const block = newBlock(type);
    updateDraft({ blocks: [...draft.blocks, block] });
    setSelectedBlockId(block.id);
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const data = await api<{ page: SitePageData }>(`/api/admin/site-pages/${draft.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: draft.title,
          metaTitle: draft.metaTitle,
          metaDescription: draft.metaDescription,
          published: draft.published,
          blocks: draft.blocks,
        }),
      });
      setDraft(data.page);
      setPages((prev) => prev.map((p) => (p.id === data.page.id ? { ...p, ...data.page } : p)));
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  };

  const reseed = async () => {
    if (!confirm("Бүх хуудсыг анхны агуулгаар дахин үүсгэх үү? Одоогийн өөрчлөлтүүд устана.")) return;
    try {
      await api("/api/admin/site-pages/seed", { method: "POST" });
      toast.success("Анхны агуулга сэргээлээ");
      setSelectedId(null);
      await loadPages();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  };

  if (loading && !pages.length) {
    return (
      <Shell>
        <div className="text-muted-foreground">Уншиж байна...</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Вэб сайт засварлагч</h1>
          <p className="text-sm text-muted-foreground">Landing page-ийн блокуудыг визуал editor-оор удирдана</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={reseed}>
            <RefreshCw className="size-4" />
            Анхны агуулга
          </Button>
          {pageMeta ? (
            <Link
              href={pageMeta.path}
              target="_blank"
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-medium hover:bg-muted"
            >
              <ExternalLink className="size-4" />
              Сайт дээр харах
            </Link>
          ) : null}
          <Button size="sm" onClick={save} disabled={saving || !draft}>
            <Save className="size-4" />
            {saving ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-12rem)] grid-cols-1 gap-4 xl:grid-cols-[220px_280px_1fr]">
        {/* Page list */}
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Layers className="size-3.5" />
            Хуудсууд
          </p>
          <div className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedId(page.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedId === page.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <div className="font-medium">{page.title}</div>
                <div className={`text-xs ${selectedId === page.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  /{page.slug} · {page.blockCount ?? page.blocks?.length ?? 0} блок
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Block list */}
        <div className="flex flex-col rounded-xl border border-border bg-card">
          <div className="border-b border-border p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Блокууд</p>
            {draft ? (
              <div className="mt-2 flex gap-2">
                <Select onValueChange={(v) => { if (typeof v === "string") addBlock(v); }}>
                  <SelectTrigger className="h-8 flex-1 text-xs">
                    <SelectValue placeholder="Блок нэмэх..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCK_SCHEMAS.map((s) => (
                      <SelectItem key={s.type} value={s.type}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {draft?.blocks.map((block, index) => {
              const schema = BLOCK_SCHEMA_MAP[block.type];
              const active = block.id === selectedBlockId;
              return (
                <div
                  key={block.id}
                  className={`rounded-lg border p-2 transition-colors ${active ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}
                >
                  <button type="button" className="w-full text-left" onClick={() => setSelectedBlockId(block.id)}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{schema?.label || block.type}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {index + 1}
                      </Badge>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {block.type === "hero" ? String(block.data.title || "") : schema?.description}
                    </p>
                  </button>
                  <div className="mt-2 flex gap-1">
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2" disabled={index === 0} onClick={() => moveBlock(index, -1)}>
                      <ArrowUp className="size-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2" disabled={index === draft.blocks.length - 1} onClick={() => moveBlock(index, 1)}>
                      <ArrowDown className="size-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => duplicateBlock(block)}>
                      <Copy className="size-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-destructive" onClick={() => removeBlock(block.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {!draft?.blocks.length ? (
              <p className="p-4 text-center text-xs text-muted-foreground">Блок байхгүй. Дээрх селектээс нэмнэ үү.</p>
            ) : null}
          </div>
        </div>

        {/* Editor + Preview */}
        <div className="flex min-h-0 flex-col rounded-xl border border-border bg-card">
          {!draft ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">Хуудас сонгоно уу</div>
          ) : (
            <Tabs defaultValue="edit" className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <TabsList>
                  <TabsTrigger value="edit">Засвар</TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="size-3.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={draft.published}
                    onChange={(e) => updateDraft({ published: e.target.checked })}
                  />
                  Нийтэлсэн
                </label>
              </div>

              <TabsContent value="edit" className="flex-1 overflow-y-auto p-4 m-0 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Хуудсын нэр</Label>
                    <Input value={draft.title} onChange={(e) => updateDraft({ title: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Slug</Label>
                    <Input value={draft.slug} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Meta title</Label>
                    <Input value={draft.metaTitle || ""} onChange={(e) => updateDraft({ metaTitle: e.target.value })} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label>Meta description</Label>
                    <Textarea value={draft.metaDescription || ""} rows={2} onChange={(e) => updateDraft({ metaDescription: e.target.value })} />
                  </div>
                </div>

                {selectedBlock && BLOCK_SCHEMA_MAP[selectedBlock.type] ? (
                  <div className="rounded-lg border border-border p-4">
                    <div className="mb-4">
                      <h3 className="font-medium">{BLOCK_SCHEMA_MAP[selectedBlock.type].label}</h3>
                      <p className="text-xs text-muted-foreground">{BLOCK_SCHEMA_MAP[selectedBlock.type].description}</p>
                    </div>
                    <BlockFieldEditor
                      fields={BLOCK_SCHEMA_MAP[selectedBlock.type].fields}
                      data={selectedBlock.data}
                      onChange={(data) => updateBlock(selectedBlock.id, { data })}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Засах блок сонгоно уу</p>
                )}
              </TabsContent>

              <TabsContent value="preview" className="flex-1 overflow-y-auto m-0 bg-[#070707]">
                <div className="pointer-events-none">
                  <SitePageRenderer blocks={draft.blocks} />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Shell>
  );
}
