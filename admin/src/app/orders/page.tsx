"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { api, tugrik } from "@/lib/api";

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  Member?: { name: string; memberCode: string };
  items?: { name: string; quantity: number; price: number }[];
};

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  async function load() {
    setItems((await api<{ orders: Order[] }>("/api/admin/orders")).orders);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Захиалга</h1>
      <Card>
        <CardHeader><CardTitle>Бүх захиалга</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Гишүүн</TableHead>
                <TableHead>Бараа</TableHead>
                <TableHead>Нийт</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.Member?.name}<div className="text-xs text-muted-foreground">{o.Member?.memberCode}</div></TableCell>
                  <TableCell>{(o.items || []).map((i) => `${i.name} ×${i.quantity}`).join(", ")}</TableCell>
                  <TableCell>{tugrik(o.total)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={async () => {
                      await api(`/api/admin/orders/${o.id}`, { method: "PUT", body: JSON.stringify({ status: "fulfilled" }) });
                      load();
                    }}>Хүргэсэн</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Shell>
  );
}
