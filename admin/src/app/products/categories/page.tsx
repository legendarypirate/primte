"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { api } from "@/lib/api";
import { errorMessage, type ProductCategory } from "@/lib/products";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);

  async function load() {
    const data = await api<{ categories: ProductCategory[] }>("/api/admin/product-categories");
    setCategories(data.categories);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(c: ProductCategory) {
    setEditing(c);
    setOpen(true);
  }

  async function remove(c: ProductCategory) {
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
          <h1 className="font-heading text-3xl text-primary">Барааны ангилал</h1>
          <p className="text-sm text-muted-foreground">Апп-ын дэлгүүрийн шүүлтүүр энэ дарааллаар харагдана.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products" className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft />
            Бараа
          </Link>
          <Button onClick={openCreate}>
            <Plus />
            Шинэ ангилал
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
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
              {categories.map((c) => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => openEdit(c)}>
                  <TableCell className="text-muted-foreground">#{c.sortOrder}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                  <TableCell>{c.productCount}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ActionCell>
                      <IconActionButton action="edit" onClick={() => openEdit(c)} />
                      <IconActionButton action="delete" onClick={() => remove(c)} />
                    </ActionCell>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Ангилал алга.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          {open && (
            <CategoryDrawerForm
              key={editing?.id ?? "new"}
              category={editing}
              nextSortOrder={Math.max(0, ...categories.map((c) => c.sortOrder)) + 1}
              onSaved={async () => {
                setOpen(false);
                await load();
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Shell>
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
