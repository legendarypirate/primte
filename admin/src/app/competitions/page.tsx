"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FieldSelect } from "@/components/field-select";

type Competition = {
  id: string;
  title: string;
  subtitle?: string;
  eventDate?: string;
  location?: string;
  capacity: number;
  fee: number;
  status: string;
  joined?: number;
  level?: string;
  stageCount?: number;
};

const empty = { title: "", subtitle: "", eventDate: "", location: "", capacity: 50, fee: 250000, status: "upcoming" };

export default function CompetitionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Competition[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState(empty);

  async function load() {
    const data = await api<{ competitions: Competition[] }>("/api/admin/competitions");
    setItems(data.competitions);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (c) =>
          (!status || c.status === status) &&
          matchesQuery(query, [c.title, c.subtitle, c.location, c.status, c.eventDate])
      ),
    [items, query, status]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${status}` });

  async function create() {
    try {
      const data = await api<{ competition: Competition }>("/api/admin/competitions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Үүсгэлээ");
      router.push(`/competitions/${data.competition.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Тэмцээн</h1>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader><CardTitle>Шинэ тэмцээн</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="IPSC Action Air" /></div>
            <div className="space-y-1"><Label>Эхлэх огноо</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
            <div className="space-y-1"><Label>Байршил</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-1">
              <Label>Төлөв</Label>
              <FieldSelect value={form.status} onChange={(status) => setForm({ ...form, status })}>
                <option value="upcoming">upcoming</option>
                <option value="open">open</option>
                <option value="past">past</option>
              </FieldSelect>
            </div>
            <Button onClick={create} disabled={!form.title.trim()}>Үүсгэх → дэлгэрэнгүй</Button>
          </CardContent>
        </Card>
        <DataTable
              search={query}
              onSearchChange={setQuery}
              searchPlaceholder="Нэр, байршил..."
              unit="тэмцээн"
              total={table.total}
              page={table.page}
              pageCount={table.pageCount}
              onPageChange={table.setPage}
              pageSize={table.pageSize}
              onPageSizeChange={table.setPageSize}
              hasActiveFilters={Boolean(status || query.trim())}
              onClear={() => {
                setStatus("");
                setQuery("");
              }}
              filters={
                <FilterField label="Төлөв" className="w-36">
                  <FieldSelect value={status} onChange={setStatus}>
                    <option value="">Бүх төлөв</option>
                    <option value="upcoming">upcoming</option>
                    <option value="open">open</option>
                    <option value="past">past</option>
                  </FieldSelect>
                </FilterField>
              }
            >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Огноо</TableHead>
                  <TableHead>Хураамж</TableHead>
                  <TableHead>Оролцогч</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.visible.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.title}</div>
                      {c.subtitle && <div className="text-xs text-muted-foreground">{c.subtitle}</div>}
                    </TableCell>
                    <TableCell>{String(c.eventDate || "").slice(0, 10)}</TableCell>
                    <TableCell>{tugrik(c.fee)}</TableCell>
                    <TableCell>{c.joined || 0}/{c.capacity}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell>
                      <ActionCell>
                        <Link
                          href={`/competitions/${c.id}/scoring`}
                          title="Оноо & үр дүн"
                          className={buttonVariants({ variant: "ghost", size: "icon" })}
                        >
                          <Trophy className="size-4 text-amber-500" />
                        </Link>
                        <IconActionButton action="edit" onClick={() => router.push(`/competitions/${c.id}`)} />
                        <IconActionButton
                          action="delete"
                          onClick={async () => {
                            if (!confirm("Устгах уу?")) return;
                            await api(`/api/admin/competitions/${c.id}`, { method: "DELETE" });
                            load();
                          }}
                        />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
                {table.visible.length === 0 && <TableEmpty colSpan={6}>Тэмцээн алга.</TableEmpty>}
              </TableBody>
            </Table>
            </DataTable>
      </div>
    </Shell>
  );
}
