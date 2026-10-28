"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { LogIn, LogOut, QrCode } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type Row = {
  id: string;
  createdAt: string;
  checkOutAt?: string | null;
  hours?: number;
  present?: boolean;
  note?: string;
  title?: string;
  Member?: { name: string; memberCode: string };
};

type Gate = { payload: string; label: string };
type Gates = { ttl: number; checkIn: Gate; checkOut: Gate };

function qrSrc(payload: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(payload)}`;
}

function when(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("mn-MN", { hour12: false });
}

export default function AttendancePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [gates, setGates] = useState<Gates | null>(null);
  const [left, setLeft] = useState(90);
  const [query, setQuery] = useState("");
  const [payload, setPayload] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadRows = useCallback(async () => {
    setItems((await api<{ attendance: Row[] }>("/api/admin/attendance")).attendance);
  }, []);

  const loadGates = useCallback(async () => {
    const data = await api<Gates>("/api/admin/attendance/gates");
    setGates(data);
    setLeft(data.ttl);
  }, []);

  useEffect(() => {
    loadRows().catch((e) => toast.error(e.message));
    loadGates().catch((e) => toast.error(e.message));
  }, [loadRows, loadGates]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setLeft((n) => {
        if (n <= 25) {
          loadGates().catch(() => undefined);
          return 90;
        }
        return n - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [loadGates]);

  const filtered = useMemo(
    () => items.filter((r) => matchesQuery(query, [r.Member?.name, r.Member?.memberCode, r.note, r.title])),
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
      const data = await api<{ member: { name: string }; message: string }>("/api/admin/attendance/scan", {
        method: "POST",
        body: JSON.stringify({ payload }),
      });
      toast.success(data.message || `${data.member.name} ирц бүртгэгдлээ`);
      close();
      await loadRows();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Ирц / QR</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Гишүүн аппаараа уншуулна. 1 цаг = 1 XP. QR {left} сек дараа шинэчлэгдэнэ.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline">
          <QrCode className="size-4" /> Гишүүний QR
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <GateCard
          title="Ирсэн"
          description="Клубт орж ирэхэд уншуулна"
          icon={<LogIn className="size-5" />}
          payload={gates?.checkIn.payload}
          accent="in"
        />
        <GateCard
          title="Явсан"
          description="Гарахдаа уншуулна. Бүтэн цаг бүр +1 XP"
          icon={<LogOut className="size-5" />}
          payload={gates?.checkOut.payload}
          accent="out"
        />
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
              <TableHead>Ирсэн</TableHead>
              <TableHead>Явсан</TableHead>
              <TableHead>Цаг</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Төлөв</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.Member?.name}</TableCell>
                <TableCell>{r.Member?.memberCode}</TableCell>
                <TableCell>{when(r.createdAt)}</TableCell>
                <TableCell>{when(r.checkOutAt)}</TableCell>
                <TableCell>{r.checkOutAt ? `${r.hours ?? 0} ц` : "—"}</TableCell>
                <TableCell>{r.checkOutAt && (r.hours ?? 0) >= 1 ? `+${r.hours}` : "—"}</TableCell>
                <TableCell>{r.present ? "Клубт байгаа" : "Гарсан"}</TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={7}>Ирц алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title="Гишүүний QR уншуулах"
        description="Аппгүй үед гишүүний QR-ийг энд уншуулж ирсэн/явсныг ээлжлэн бүртгэнэ."
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

function GateCard({
  title,
  description,
  icon,
  payload,
  accent,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  payload?: string;
  accent: "in" | "out";
}) {
  const ring = accent === "in" ? "ring-emerald-500/30" : "ring-amber-500/30";
  return (
    <Card className={ring}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pb-6">
        <div className="rounded-xl bg-white p-3">
          {payload ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc(payload)} alt={`${title} QR`} width={240} height={240} className="size-60" />
          ) : (
            <div className="flex size-60 items-center justify-center text-muted-foreground">QR ачаалж байна...</div>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground">Аппын QR табаар уншуулна</p>
      </CardContent>
    </Card>
  );
}
