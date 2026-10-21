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
import { errorMessage, type Product, type ProductCategory } from "@/lib/products";
import { cn } from "@/lib/utils";
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type ProductForm = {
  name: string;
  price: number;
  category: string;
  subtitle: string;
  description: string;
  features: string;
  inStock: boolean;
  images: string[];
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
  images: [],
  relatedIds: [],
};

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
    () => Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    [categories]
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (p) => (filter === "all" || p.category === filter) && matchesQuery(query, [p.name, p.subtitle, p.category])
      ),
    [items, filter, query]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${filter}` });
  const filteredCategories = useMemo(
    () => categories.filter((c) => matchesQuery(categoryQuery, [c.name, c.slug])),
    [categories, categoryQuery]
  );
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

  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryOpen(true);
  }

  function openEditCategory(c: ProductCategory) {
    setEditingCategory(c);
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
                <TableHead>Төлөв</TableHead>
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
                          <p className="truncate font-medium">{p.name}</p>
                          {p.subtitle && <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tugrik(p.price)}</TableCell>
                    <TableCell>{categoryName[p.category] || p.categoryLabel || p.category}</TableCell>
                    <TableCell>{images.length}</TableCell>
                    <TableCell>{p.relatedIds?.length ? p.relatedIds.length : <span className="text-muted-foreground">Авто</span>}</TableCell>
                    <TableCell>
                      <StatusBadge active={p.inStock} activeLabel="Бэлэн" inactiveLabel="Дууссан" />
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Бараа</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryTable.visible.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer" onClick={() => openEditCategory(c)}>
                    <TableCell className="text-muted-foreground">#{c.sortOrder}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                    <TableCell>{c.productCount}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <ActionCell>
                        <IconActionButton action="edit" onClick={() => openEditCategory(c)} />
                        <IconActionButton action="delete" onClick={() => removeCategory(c)} />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
                {categoryTable.visible.length === 0 && <TableEmpty colSpan={5}>Ангилал алга.</TableEmpty>}
              </TableBody>
            </Table>
          </DataTable>
        </TabsContent>
      </Tabs>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-xl">
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
              key={editingCategory?.id ?? "new"}
              category={editingCategory}
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
          category: product.category,
          subtitle: product.subtitle || "",
          description: product.description || "",
          features: (product.features || []).join(", "),
          inStock: product.inStock,
          images: productImages(product),
          relatedIds: product.relatedIds || [],
        }
      : { ...empty, category: categories[0]?.slug || "" }
  );
  const [relatedQuery, setRelatedQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const productName = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p.name])), [products]);
  const categoryName = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.name])), [categories]);
  const rq = relatedQuery.trim().toLowerCase();
  const relatedCandidates = products.filter(
    (p) => p.id !== product?.id && !form.relatedIds.includes(p.id) && (!rq || p.name.toLowerCase().includes(rq))
  );

  async function save() {
    if (!form.name.trim()) return toast.error("Барааны нэр оруулна уу.");
    if (!form.category) return toast.error("Ангилал сонгоно уу.");
    const payload = {
      ...form,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
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
        <MultiImageUpload
          folder="prime/products"
          value={form.images}
          onChange={(images) => setForm((f) => ({ ...f, images }))}
        />
        <div className="space-y-1"><Label>Нэр</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
        <div className="space-y-1"><Label>Тайлбар</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
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
  nextSortOrder,
  onSaved,
  onCancel,
}: {
  category: ProductCategory | null;
  nextSortOrder: number;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? nextSortOrder);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return toast.error("Ангиллын нэр оруулна уу.");
    setSaving(true);
    try {
      const body = JSON.stringify({ name, sortOrder });
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
        <SheetTitle>{category ? "Ангилал засах" : "Шинэ ангилал"}</SheetTitle>
        <SheetDescription>
          {category ? `${category.productCount} бараа энэ ангилалд байна.` : "Дэлгүүрийн шинэ ангилал нэмэх"}
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} />
        </div>
        <div className="space-y-1">
          <Label>Эрэмбэ</Label>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          <p className="text-xs text-muted-foreground">Бага тоо эхэнд харагдана.</p>
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
