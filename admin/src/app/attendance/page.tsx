"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { QrCode } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type Row = { id: string; createdAt: string; note?: string; Member?: { name: string; memberCode: string } };

export default function AttendancePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [payload, setPayload] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems((await api<{ attendance: Row[] }>("/api/admin/attendance")).attendance);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  const filtered = useMemo(
    () => items.filter((r) => matchesQuery(query, [r.Member?.name, r.Member?.memberCode, r.note])),
    [items, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  function close() {
    setOpen(false);
    setPayload("");
  }

  async function scan() {
    if (!payload.trim()) return toast.error("QR код оруулна уу.");
    setSaving(true);
    try {
      const data = await api<{ member: { name: string } }>("/api/admin/attendance/scan", {
        method: "POST",
        body: JSON.stringify({ payload }),
      });
      toast.success(`${data.member.name} ирц бүртгэгдлээ`);
      close();
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Ирц / QR</h1>
        <Button onClick={() => setOpen(true)}>
          <QrCode className="size-4" /> QR уншуулах
        </Button>
      </div>
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
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гишүүн</TableHead>
              <TableHead>Код</TableHead>
              <TableHead>Цаг</TableHead>
            </TableRow>
          </TableHeader>
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

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title="QR уншуулах"
        description="Гишүүний QR кодыг уншуулж ирц бүртгэнэ."
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={scan} disabled={saving}>{saving ? "Бүртгэж байна..." : "Бүртгэх"}</Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>QR код</Label>
          <Input
            autoFocus
            placeholder="PRIME|PRIME-000125|timestamp"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan()}
          />
        </div>
      </FormDrawer>
    </Shell>
  );
}
