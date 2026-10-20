"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type Row = { id: string; createdAt: string; note?: string; Member?: { name: string; memberCode: string } };

export default function AttendancePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [payload, setPayload] = useState("");

  async function load() {
    setItems((await api<{ attendance: Row[] }>("/api/admin/attendance")).attendance);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  const filtered = useMemo(
    () => items.filter((r) => matchesQuery(query, [r.Member?.name, r.Member?.memberCode, r.note])),
    [items, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Ирц / QR</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>QR уншуулах</CardTitle></CardHeader>
        <CardContent className="flex gap-3">
          <Input placeholder="PRIME|PRIME-000125|timestamp" value={payload} onChange={(e) => setPayload(e.target.value)} />
          <Button onClick={async () => {
            try {
              const data = await api<{ member: { name: string } }>("/api/admin/attendance/scan", { method: "POST", body: JSON.stringify({ payload }) });
              toast.success(`${data.member.name} ирц бүртгэгдлээ`);
              setPayload("");
              load();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Алдаа");
            }
          }}>Бүртгэх</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Сүүлийн ирц</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Гишүүн, код..."
            unit="ирц"
            total={table.total}
            page={table.page}
            pageCount={table.pageCount}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
            from={table.from}
            to={table.to}
          >
          <Table>
            <TableHeader><TableRow><TableHead>Гишүүн</TableHead><TableHead>Код</TableHead><TableHead>Цаг</TableHead></TableRow></TableHeader>
            <TableBody>
              {table.visible.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.Member?.name}</TableCell>
                  <TableCell>{r.Member?.memberCode}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {table.visible.length === 0 && <TableEmpty colSpan={3}>Ирц алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>
        </CardContent>
      </Card>
    </Shell>
  );
}
