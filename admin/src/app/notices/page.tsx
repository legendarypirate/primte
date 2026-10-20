"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type Notice = { id: string; title: string; body: string; published: boolean; createdAt: string };

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", body: "" });

  async function load() {
    setItems((await api<{ notices: Notice[] }>("/api/admin/notices")).notices);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  const filtered = useMemo(
    () => items.filter((n) => matchesQuery(query, [n.title, n.body])),
    [items, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Мэдэгдэл</h1>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Шинэ мэдэгдэл</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Гарчиг</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Агуулга</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
            <Button onClick={async () => {
              await api("/api/admin/notices", { method: "POST", body: JSON.stringify({ ...form, published: true }) });
              setForm({ title: "", body: "" });
              load();
              toast.success("Нийтэллээ");
            }}>Нийтлэх</Button>
          </CardContent>
        </Card>
        <DataTable
              search={query}
              onSearchChange={setQuery}
              searchPlaceholder="Мэдэгдэл хайх..."
              unit="мэдэгдэл"
              total={table.total}
              page={table.page}
              pageCount={table.pageCount}
              onPageChange={table.setPage}
              pageSize={table.pageSize}
              onPageSizeChange={table.setPageSize}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Гарчиг</TableHead>
                    <TableHead>Агуулга</TableHead>
                    <TableHead>Төлөв</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.visible.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-medium">{n.title}</TableCell>
                      <TableCell className="max-w-sm truncate text-muted-foreground">{n.body}</TableCell>
                      <TableCell>
                        <StatusBadge active={n.published} activeLabel="Нийтэлсэн" inactiveLabel="Ноорог" />
                      </TableCell>
                      <TableCell>
                        <ActionCell>
                          <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/notices/${n.id}`, { method: "DELETE" }); load(); }} />
                        </ActionCell>
                      </TableCell>
                    </TableRow>
                  ))}
                  {table.visible.length === 0 && <TableEmpty colSpan={4}>Мэдэгдэл алга.</TableEmpty>}
                </TableBody>
              </Table>
            </DataTable>
      </div>
    </Shell>
  );
}
