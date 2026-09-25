"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus, X } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/file-upload";
import { FieldSelect } from "@/components/field-select";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryLabel?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  inStock: boolean;
  imageUrl?: string;
  relatedIds?: string[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  productCount: number;
};

type ProductForm = {
  name: string;
  price: number;
  category: string;
  subtitle: string;
  description: string;
  features: string;
  inStock: boolean;
  imageUrl: string;
  relatedIds: string[];
};

const empty: ProductForm = {
  name: "",
  price: 0,
  category: "",
  subtitle: "",
  description: "",
  features: "",
  inStock: true,
  imageUrl: "",
  relatedIds: [],
};

function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Алдаа";
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [relatedQuery, setRelatedQuery] = useState("");

  async function load() {
    const [productData, categoryData] = await Promise.all([
      api<{ products: Product[] }>("/api/admin/products"),
      api<{ categories: Category[] }>("/api/admin/product-categories"),
    ]);
    setItems(productData.products);
    setCategories(categoryData.categories);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  const categoryName = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    [categories]
  );
  const productName = useMemo(() => Object.fromEntries(items.map((p) => [p.id, p.name])), [items]);

  const visible = filter === "all" ? items : items.filter((p) => p.category === filter);

  const relatedCandidates = items.filter(
    (p) =>
      p.id !== editing &&
      !form.relatedIds.includes(p.id) &&
      (!relatedQuery.trim() || p.name.toLowerCase().includes(relatedQuery.trim().toLowerCase()))
  );

  function resetForm() {
    setForm(empty);
    setEditing(null);
    setRelatedQuery("");
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Барааны нэр оруулна уу.");
    if (!form.category) return toast.error("Ангилал сонгоно уу.");
    const payload = {
      ...form,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await api(`/api/admin/products/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      resetForm();
      await load();
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  function startEdit(p: Product) {
    setEditing(p.id);
    setRelatedQuery("");
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      subtitle: p.subtitle || "",
      description: p.description || "",
      features: (p.features || []).join(", "),
      inStock: p.inStock,
      imageUrl: p.imageUrl || "",
      relatedIds: p.relatedIds || [],
    });
  }

  async function remove(p: Product) {
    if (!confirm(`"${p.name}" барааг устгах уу?`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, { method: "DELETE" });
      if (editing === p.id) resetForm();
      await load();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Дэлгүүр</h1>
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>{editing ? "Бараа засах" : "Шинэ бараа"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1"><Label>Нэр</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-1"><Label>Үнэ</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-1">
                <Label>Ангилал</Label>
                <FieldSelect value={form.category} onChange={(category) => setForm({ ...form, category })}>
                  <option value="">Сонгох</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </FieldSelect>
              </div>
              <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
              <div className="space-y-1"><Label>Тайлбар</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-1"><Label>Онцлог (таслалаар)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="size-4 accent-primary"
                />
                Бэлэн байгаа
              </label>
              <FileUpload
                label="Зураг"
                folder="prime/products"
                value={form.imageUrl}
                onChange={(imageUrl) => setForm({ ...form, imageUrl })}
              />
              <div className="space-y-2">
                <Label>Тохирох тоноглолууд</Label>
                <p className="text-xs text-muted-foreground">
                  Апп-ын барааны дэлгэрэнгүй дээр харагдана. Сонгоогүй бол ижил ангиллын бараа автоматаар гарна.
                </p>
                {form.relatedIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.relatedIds.map((id) => (
                      <Badge key={id} variant="secondary" className="gap-1 pr-1">
                        {productName[id] || "Устгагдсан бараа"}
                        <button
                          type="button"
                          aria-label="Хасах"
                          className="rounded-sm p-0.5 hover:bg-background/40"
                          onClick={() => setForm({ ...form, relatedIds: form.relatedIds.filter((x) => x !== id) })}
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Input placeholder="Бараа хайх..." value={relatedQuery} onChange={(e) => setRelatedQuery(e.target.value)} />
                <div className="max-h-44 overflow-y-auto rounded-lg border border-input">
                  {relatedCandidates.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground">Нэмэх бараа алга.</p>
                  ) : (
                    relatedCandidates.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm({ ...form, relatedIds: [...form.relatedIds, p.id] })}
                        className="flex w-full items-center justify-between gap-2 border-b border-input px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted"
                      >
                        <span className="truncate">{p.name}</span>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          {categoryName[p.category] || p.category}
                          <Plus className="size-3.5" />
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
                {editing && <Button variant="outline" onClick={resetForm}>Болих</Button>}
              </div>
            </CardContent>
          </Card>
          <CategoryManager categories={categories} onChanged={load} />
        </div>
        <Card>
          <CardHeader><CardTitle>Бараа</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[{ slug: "all", name: "Бүгд", count: items.length }, ...categories.map((c) => ({ slug: c.slug, name: c.name, count: c.productCount }))].map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setFilter(c.slug)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === c.slug ? "border-primary bg-primary text-primary-foreground" : "border-input text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c.name} <span className="opacity-70">({c.count})</span>
                </button>
              ))}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Үнэ</TableHead>
                  <TableHead>Ангилал</TableHead>
                  <TableHead>Тохирох</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((p) => (
                  <TableRow key={p.id} className={cn(editing === p.id && "bg-muted/50")}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt="" className="size-9 rounded-md object-cover" />
                        ) : (
                          <div className="size-9 rounded-md bg-muted" />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tugrik(p.price)}</TableCell>
                    <TableCell>{categoryName[p.category] || p.categoryLabel || p.category}</TableCell>
                    <TableCell>{p.relatedIds?.length ? p.relatedIds.length : <span className="text-muted-foreground">Авто</span>}</TableCell>
                    <TableCell>
                      {p.inStock ? <Badge variant="secondary">Бэлэн</Badge> : <Badge variant="destructive">Дууссан</Badge>}
                    </TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton action="edit" onClick={() => startEdit(p)} />
                        <IconActionButton action="delete" onClick={() => remove(p)} />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Бараа алга.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}

function CategoryManager({ categories, onChanged }: { categories: Category[]; onChanged: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: "", sortOrder: 0 });

  async function create() {
    if (!name.trim()) return;
    try {
      await api("/api/admin/product-categories", { method: "POST", body: JSON.stringify({ name }) });
      setName("");
      await onChanged();
      toast.success("Ангилал нэмлээ");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function update(id: string) {
    try {
      await api(`/api/admin/product-categories/${id}`, { method: "PUT", body: JSON.stringify(draft) });
      setEditingId(null);
      await onChanged();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function remove(c: Category) {
    if (!confirm(`"${c.name}" ангиллыг устгах уу?`)) return;
    try {
      await api(`/api/admin/product-categories/${c.id}`, { method: "DELETE" });
      await onChanged();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Ангилал</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Шинэ ангиллын нэр"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
          />
          <Button onClick={create}><Plus />Нэмэх</Button>
        </div>
        <div className="divide-y divide-input rounded-lg border border-input">
          {categories.map((c) =>
            editingId === c.id ? (
              <div key={c.id} className="flex items-center gap-2 p-2">
                <Input
                  type="number"
                  className="w-16"
                  title="Эрэмбэ"
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
                />
                <Input
                  value={draft.name}
                  autoFocus
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && update(c.id)}
                />
                <Button size="icon-sm" onClick={() => update(c.id)} aria-label="Хадгалах"><Check /></Button>
                <Button size="icon-sm" variant="outline" onClick={() => setEditingId(null)} aria-label="Болих"><X /></Button>
              </div>
            ) : (
              <div key={c.id} className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.productCount} бараа · #{c.sortOrder}</p>
                </div>
                <ActionCell>
                  <IconActionButton
                    action="edit"
                    onClick={() => {
                      setEditingId(c.id);
                      setDraft({ name: c.name, sortOrder: c.sortOrder });
                    }}
                  />
                  <IconActionButton action="delete" onClick={() => remove(c)} />
                </ActionCell>
              </div>
            )
          )}
          {categories.length === 0 && <p className="p-3 text-xs text-muted-foreground">Ангилал алга.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
