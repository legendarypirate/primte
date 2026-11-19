"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { MultiImageUpload } from "@/components/multi-image-upload";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { api, assetUrl, tugrik } from "@/lib/api";
import {
  categoryDescendantSlugs,
  categoryLabel,
  errorMessage,
  flattenCategoryTree,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type ProductForm = {
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  category: string;
  description: string;
  stock: number;
  featured: boolean;
  images: string[];
  relatedIds: string[];
};

const empty: ProductForm = {
  name: "",
  price: 0,
  originalPrice: 0,
  discountPercent: 0,
  category: "",
  description: "",
  stock: 0,
  featured: false,
  images: [],
  relatedIds: [],
};

function saleDiscount(originalPrice: number, price: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.min(99, Math.max(1, Math.round(((originalPrice - price) / originalPrice) * 100)));
}

function productImages(p: Product) {
  if (p.images?.length) return p.images;
  return p.imageUrl ? [p.imageUrl] : [];
}

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [tab, setTab] = useState("products");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [createParentId, setCreateParentId] = useState<string | null>(null);

  async function load() {
    const [productData, categoryData] = await Promise.all([
      api<{ products: Product[] }>("/api/admin/products"),
      api<{ categories: ProductCategory[] }>("/api/admin/product-categories"),
    ]);
    setItems(productData.products);
    setCategories(categoryData.categories);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "categories") {
      setTab("categories");
    }
  }, []);

  const categoryName = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.path || c.name])),
    [categories]
  );

  const filtered = useMemo(() => {
    const slugs = filter === "all" ? null : new Set(categoryDescendantSlugs(categories, filter));
    return items.filter(
      (p) =>
        (!slugs || slugs.has(p.category)) &&
        matchesQuery(query, [p.name, p.subtitle, p.category, categoryName[p.category]])
    );
  }, [items, filter, query, categories, categoryName]);
  const table = useClientTable(filtered, { resetKey: `${query}|${filter}` });
  const filteredCategories = useMemo(() => {
    const tree = flattenCategoryTree(categories);
    if (!categoryQuery.trim()) return tree;
    const matched = new Set(
      tree
        .filter((c) => matchesQuery(categoryQuery, [c.name, c.slug, c.parentName, c.path]))
        .map((c) => c.id)
    );
    const byId = Object.fromEntries(categories.map((c) => [c.id, c]));
    const keep = new Set(matched);
    for (const id of matched) {
      let cur = byId[id];
      while (cur?.parentId) {
        keep.add(cur.parentId);
        cur = byId[cur.parentId];
      }
    }
    return tree.filter((c) => keep.has(c.id));
  }, [categories, categoryQuery]);
  const categoryTable = useClientTable(filteredCategories, { resetKey: categoryQuery });

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setOpen(true);
  }

  async function remove(p: Product) {
    if (!confirm(`"${p.name}" барааг устгах уу?`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, { method: "DELETE" });
      await load();
      toast.success("Устгалаа");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  function openCreateCategory(parentId: string | null = null) {
    setEditingCategory(null);
    setCreateParentId(parentId);
    setCategoryOpen(true);
  }

  function openEditCategory(c: ProductCategory) {
    setEditingCategory(c);
    setCreateParentId(c.parentId);
    setCategoryOpen(true);
  }

  async function removeCategory(c: ProductCategory) {
    if (!confirm(`"${c.name}" ангиллыг устгах уу?`)) return;
    try {
      await api(`/api/admin/product-categories/${c.id}`, { method: "DELETE" });
      await load();
      toast.success("Устгалаа");
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Бараа</h1>
          <p className="text-sm text-muted-foreground">{items.length} бараа · {categories.length} ангилал</p>
        </div>
        {tab === "categories" ? (
          <Button onClick={openCreateCategory}>
            <Plus className="size-4" /> Шинэ ангилал
          </Button>
        ) : (
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Шинэ бараа
          </Button>
        )}
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => {
          const next = String(value);
          setTab(next);
          window.history.replaceState(null, "", next === "categories" ? "/products?tab=categories" : "/products");
        }}
        className="gap-4"
      >
        <TabsList variant="line" className="mb-2">
          <TabsTrigger value="products">Бараа</TabsTrigger>
          <TabsTrigger value="categories">Ангилал</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Бараа хайх..."
            unit="бараа"
            total={table.total}
            page={table.page}
            pageCount={table.pageCount}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
            hasActiveFilters={filter !== "all" || Boolean(query.trim())}
            onClear={() => {
              setFilter("all");
              setQuery("");
            }}
            filters={
              <div className="flex flex-wrap gap-2">
                {[{ slug: "all", name: "Бүгд", count: items.length }, ...flattenCategoryTree(categories).map((c) => ({ slug: c.slug, name: categoryLabel(c), count: c.totalProductCount ?? c.productCount }))].map((c) => (
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
            }
          >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Ангилал</TableHead>
                <TableHead>Зураг</TableHead>
                <TableHead>Тохирох</TableHead>
                    <TableHead>Үлдэгдэл</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.visible.map((p) => {
                const images = productImages(p);
                return (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => openEdit(p)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={assetUrl(images[0])} alt="" className="size-10 rounded-md object-cover" />
                        ) : (
                          <div className="size-10 rounded-md bg-muted" />
                        )}
                        <div className="min-w-0">
                          <p className="flex min-w-0 items-center gap-2 font-medium">
                            <span className="truncate">{p.name}</span>
                            {p.featured && (
                              <Badge variant="secondary" className="shrink-0">Онцгой</Badge>
                            )}
                          </p>
                          {p.subtitle && <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <span>{tugrik(p.price)}</span>
                        {(p.originalPrice ?? 0) > p.price && (
                          <>
                            <span className="text-xs text-muted-foreground line-through">{tugrik(p.originalPrice)}</span>
                            {saleDiscount(p.originalPrice ?? 0, p.price) > 0 && (
                              <Badge variant="secondary">-{saleDiscount(p.originalPrice ?? 0, p.price)}%</Badge>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{categoryName[p.category] || p.categoryLabel || p.category}</TableCell>
                    <TableCell>{images.length}</TableCell>
                    <TableCell>{p.relatedIds?.length ? p.relatedIds.length : <span className="text-muted-foreground">Авто</span>}</TableCell>
                    <TableCell>
                      <StatusBadge
                        active={(p.stock ?? 0) > 0}
                        activeLabel={`${p.stock ?? 0}`}
                        inactiveLabel="Дууссан"
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <ActionCell>
                        <IconActionButton action="edit" onClick={() => openEdit(p)} />
                        <IconActionButton action="delete" onClick={() => remove(p)} />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                );
              })}
              {table.visible.length === 0 && <TableEmpty colSpan={7}>Бараа алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>
        </TabsContent>
        <TabsContent value="categories">
          <DataTable
            search={categoryQuery}
            onSearchChange={setCategoryQuery}
            searchPlaceholder="Ангилал хайх..."
            unit="ангилал"
            total={categoryTable.total}
            page={categoryTable.page}
            pageCount={categoryTable.pageCount}
            onPageChange={categoryTable.setPage}
            pageSize={categoryTable.pageSize}
            onPageSizeChange={categoryTable.setPageSize}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Эрэмбэ</TableHead>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Эцэг</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Бараа</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryTable.visible.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => openEditCategory(c)}>
                    <TableCell className="text-muted-foreground">#{c.sortOrder}</TableCell>
                    <TableCell className="font-medium">
                      <span
                        className="inline-flex items-center gap-2"
                        style={{ paddingLeft: `${(c.depth ?? 0) * 1.25}rem` }}
                      >
                        {(c.depth ?? 0) > 0 && <span className="text-muted-foreground">└</span>}
                        {c.name}
                        {(c.childCount ?? 0) > 0 && (
                          <Badge variant="secondary" className="font-normal">
                            {c.childCount} дэд
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.parentName || "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                    <TableCell>{c.totalProductCount ?? c.productCount}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <ActionCell>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          title="Дэд ангилал"
                          aria-label="Дэд ангилал"
                          className="size-8 shrink-0 rounded-md text-muted-foreground shadow-sm"
                          onClick={() => openCreateCategory(c.id)}
                        >
                          <Plus />
                        </Button>
                        <IconActionButton action="edit" onClick={() => openEditCategory(c)} />
                        <IconActionButton action="delete" onClick={() => removeCategory(c)} />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
                {categoryTable.visible.length === 0 && <TableEmpty colSpan={6}>Ангилал алга.</TableEmpty>}
              </TableBody>
            </Table>
          </DataTable>
        </TabsContent>
      </Tabs>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-3xl">
          {open && (
            <ProductDrawerForm
              key={editing?.id ?? "new"}
              product={editing}
              products={items}
              categories={categories}
              onSaved={async () => {
                setOpen(false);
                await load();
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
      <Sheet open={categoryOpen} onOpenChange={setCategoryOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {categoryOpen && (
            <CategoryDrawerForm
              key={`${editingCategory?.id ?? "new"}-${createParentId ?? ""}`}
              category={editingCategory}
              categories={categories}
              initialParentId={editingCategory?.parentId ?? createParentId}
              nextSortOrder={Math.max(0, ...categories.map((c) => c.sortOrder)) + 1}
              onSaved={async () => {
                setCategoryOpen(false);
                await load();
              }}
              onCancel={() => setCategoryOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Shell>
  );
}

function ProductDrawerForm({
  product,
  products,
  categories,
  onSaved,
  onCancel,
}: {
  product: Product | null;
  products: Product[];
  categories: ProductCategory[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductForm>(() =>
    product
      ? {
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice ?? 0,
          discountPercent: saleDiscount(product.originalPrice ?? 0, product.price),
          category: product.category,
          description: product.description || "",
          stock: product.stock ?? 0,
          featured: Boolean(product.featured),
          images: productImages(product),
          relatedIds: product.relatedIds || [],
        }
      : { ...empty, category: categories[0]?.slug || "" }
  );
  const [relatedQuery, setRelatedQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const productName = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p.name])), [products]);
  const categoryName = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.path || c.name])), [categories]);
  const rq = relatedQuery.trim().toLowerCase();
  const relatedCandidates = products.filter(
    (p) => p.id !== product?.id && !form.relatedIds.includes(p.id) && (!rq || p.name.toLowerCase().includes(rq))
  );

  async function save() {
    if (!form.name.trim()) return toast.error("Барааны нэр оруулна уу.");
    if (!form.category) return toast.error("Ангилал сонгоно уу.");
    const payload = {
      name: form.name,
      price: form.price,
      originalPrice: form.discountPercent > 0 ? form.originalPrice : 0,
      category: form.category,
      description: form.description,
      stock: form.stock,
      featured: form.featured,
      images: form.images,
      relatedIds: form.relatedIds,
    };
    setSaving(true);
    try {
      if (product) await api(`/api/admin/products/${product.id}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      toast.success("Хадгаллаа");
      await onSaved();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SheetHeader className="border-b border-border">
        <SheetTitle>{product ? "Бараа засах" : "Шинэ бараа"}</SheetTitle>
        <SheetDescription>{product ? product.name : "Дэлгүүрт шинэ бараа нэмэх"}</SheetDescription>
      </SheetHeader>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1"><Label>Нэр</Label><Input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-1">
          <Label>Ангилал</Label>
          <FieldSelect value={form.category} onChange={(category) => setForm({ ...form, category })}>
            <option value="">Сонгох</option>
            {flattenCategoryTree(categories).map((c) => (
              <option key={c.id} value={c.slug}>{categoryLabel(c)}</option>
            ))}
          </FieldSelect>
        </div>
        <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-sm font-semibold">Үнэ, хямдрал</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Үнэ</Label>
              <Input
                type="number"
                min={0}
                value={form.discountPercent > 0 ? form.originalPrice : form.price}
                onChange={(e) => {
                  const next = Math.max(0, Number(e.target.value) || 0);
                  if (form.discountPercent > 0) {
                    setForm({
                      ...form,
                      originalPrice: next,
                      price: Math.round(next * (100 - form.discountPercent) / 100),
                    });
                    return;
                  }
                  setForm({ ...form, originalPrice: 0, price: next });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label>Хямдрал %</Label>
              <Input
                type="number"
                min={0}
                max={99}
                value={form.discountPercent}
                onChange={(e) => {
                  const discountPercent = Math.min(99, Math.max(0, Number(e.target.value) || 0));
                  const originalPrice = form.originalPrice > 0 ? form.originalPrice : form.price;
                  if (discountPercent <= 0) {
                    setForm({ ...form, discountPercent: 0, originalPrice: 0, price: originalPrice || form.price });
                    return;
                  }
                  setForm({
                    ...form,
                    discountPercent,
                    originalPrice,
                    price: Math.round(originalPrice * (100 - discountPercent) / 100),
                  });
                }}
              />
            </div>
          </div>
          {form.discountPercent > 0 ? (
            <>
              <div className="space-y-1">
                <Label>Хямдралтай үнэ</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => {
                    const price = Math.max(0, Number(e.target.value) || 0);
                    const originalPrice = form.originalPrice > 0 ? form.originalPrice : price;
                    const discountPercent = saleDiscount(originalPrice, price);
                    setForm({
                      ...form,
                      price,
                      originalPrice: discountPercent > 0 ? originalPrice : 0,
                      discountPercent,
                    });
                  }}
                />
              </div>
              {form.originalPrice > form.price && (
                <p className="text-sm font-medium text-primary">
                  {tugrik(form.originalPrice)} → {tugrik(form.price)} (−{form.discountPercent}%)
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Хямдрал % оруулбал апп дээр хуучин үнэ болон хувь харагдана.</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Үлдэгдэл</Label>
            <Input
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="size-4 accent-primary"
            />
            Онцгой бараа
          </label>
        </div>
        <div className="space-y-1"><Label>Тайлбар</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <MultiImageUpload
          folder="prime/products"
          value={form.images}
          onChange={(images) => setForm((f) => ({ ...f, images }))}
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
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onCancel}>Болих</Button>
        <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : product ? "Шинэчлэх" : "Үүсгэх"}</Button>
      </SheetFooter>
    </>
  );
}

function CategoryDrawerForm({
  category,
  categories,
  initialParentId,
  nextSortOrder,
  onSaved,
  onCancel,
}: {
  category: ProductCategory | null;
  categories: ProductCategory[];
  initialParentId: string | null;
  nextSortOrder: number;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [parentId, setParentId] = useState(initialParentId ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? nextSortOrder);
  const [saving, setSaving] = useState(false);

  const parentOptions = useMemo(() => {
    const blocked = new Set<string>();
    if (category) {
      blocked.add(category.id);
      const stack = [category.id];
      while (stack.length) {
        const id = stack.pop()!;
        for (const child of categories.filter((c) => c.parentId === id)) {
          if (blocked.has(child.id)) continue;
          blocked.add(child.id);
          stack.push(child.id);
        }
      }
    }
    return flattenCategoryTree(categories).filter((c) => !blocked.has(c.id));
  }, [categories, category]);

  async function save() {
    if (!name.trim()) return toast.error("Ангиллын нэр оруулна уу.");
    setSaving(true);
    try {
      const body = JSON.stringify({ name, sortOrder, parentId: parentId || null });
      if (category) await api(`/api/admin/product-categories/${category.id}`, { method: "PUT", body });
      else await api("/api/admin/product-categories", { method: "POST", body });
      toast.success("Хадгаллаа");
      await onSaved();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SheetHeader className="border-b border-border">
        <SheetTitle>{category ? "Ангилал засах" : parentId ? "Шинэ дэд ангилал" : "Шинэ ангилал"}</SheetTitle>
        <SheetDescription>
          {category
            ? `${category.totalProductCount ?? category.productCount} бараа энэ ангилалд байна.`
            : "Дэлгүүрийн шинэ ангилал нэмэх"}
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />
        </div>
        <div className="space-y-1">
          <Label>Эцэг ангилал</Label>
          <FieldSelect value={parentId} onChange={setParentId}>
            <option value="">Үндсэн ангилал</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>{categoryLabel(c)}</option>
            ))}
          </FieldSelect>
          <p className="text-xs text-muted-foreground">Хоосон бол үндсэн (эцэггүй) ангилал болно.</p>
        </div>
        <div className="space-y-1">
          <Label>Эрэмбэ</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          <p className="text-xs text-muted-foreground">Бага тоо эхэнд харагдана. Ижил эцэг дотор эрэмбэлнэ.</p>
        </div>
        {category && (
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input value={category.slug} disabled className="font-mono text-xs" />
            <p className="text-xs text-muted-foreground">Бараатай холбогдсон тул өөрчлөгдөхгүй.</p>
          </div>
        )}
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onCancel}>Болих</Button>
        <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : category ? "Шинэчлэх" : "Үүсгэх"}</Button>
      </SheetFooter>
    </>
  );
}
