"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

type Row = { id: string; createdAt: string; note?: string; Member?: { name: string; memberCode: string } };

export default function AttendancePage() {
  const [items, setItems] = useState<Row[]>([]);
  const [payload, setPayload] = useState("");

  async function load() {
    setItems((await api<{ attendance: Row[] }>("/api/admin/attendance")).attendance);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

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
          <Table>
            <TableHeader><TableRow><TableHead>Гишүүн</TableHead><TableHead>Код</TableHead><TableHead>Цаг</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.Member?.name}</TableCell>
                  <TableCell>{r.Member?.memberCode}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Shell>
  );
}
