"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

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
};

const empty = {
  name: "",
  price: 0,
  category: "bb",
  categoryLabel: "",
  subtitle: "",
  description: "",
  features: "",
  inStock: true,
  imageUrl: "",
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const data = await api<{ products: Product[] }>("/api/admin/products");
    setItems(data.products);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  async function save() {
    const payload = {
      ...form,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await api(`/api/admin/products/${editing}`, { method: "PUT", body: JSON.stringify(payload) });
      else await api("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      setForm(empty);
      setEditing(null);
      await load();
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Дэлгүүр</h1>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>{editing ? "Засах" : "Шинэ бараа"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><Label>Үнэ</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            <div className="space-y-1"><Label>Ангилал</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div className="space-y-1"><Label>Тайлбар</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-1"><Label>Онцлог (таслалаар)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
            <FileUpload
              label="Зураг"
              folder="prime/products"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm({ ...form, imageUrl })}
            />
            <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Бараа</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Үнэ</TableHead>
                  <TableHead>Ангилал</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{tugrik(p.price)}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(p.id);
                            setForm({
                              name: p.name,
                              price: p.price,
                              category: p.category,
                              categoryLabel: p.categoryLabel || "",
                              subtitle: p.subtitle || "",
                              description: p.description || "",
                              features: (p.features || []).join(", "),
                              inStock: p.inStock,
                              imageUrl: p.imageUrl || "",
                            });
                          }}
                        />
                        <IconActionButton
                          action="delete"
                          onClick={async () => {
                            await api(`/api/admin/products/${p.id}`, { method: "DELETE" });
                            load();
                          }}
                        />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
