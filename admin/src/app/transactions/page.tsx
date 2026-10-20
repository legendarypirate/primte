"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FieldSelect } from "@/components/field-select";

type Tx = { id: string; title: string; amount: number; kind: string; createdAt: string; Member?: { name: string } };

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  useEffect(() => {
    api<{ transactions: Tx[] }>("/api/admin/transactions").then((d) => setItems(d.transactions)).catch((e) => toast.error(e.message));
  }, []);
  const filtered = useMemo(
    () =>
      items.filter(
        (t) => (!kind || t.kind === kind) && matchesQuery(query, [t.Member?.name, t.title, t.kind, t.amount])
      ),
    [items, query, kind]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${kind}` });
  const kinds = useMemo(() => [...new Set(items.map((t) => t.kind).filter(Boolean))], [items]);

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Гүйлгээ</h1>
      <Card>
        <CardHeader><CardTitle>Wallet түүх</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Гишүүн, гүйлгээ..."
            unit="гүйлгээ"
            total={table.total}
            page={table.page}
            pageCount={table.pageCount}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
            from={table.from}
            to={table.to}
            filters={
              kinds.length ? (
                <div className="w-36">
                  <FieldSelect value={kind} onChange={setKind}>
                    <option value="">Бүх төрөл</option>
                    {kinds.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </FieldSelect>
                </div>
              ) : null
            }
          >
          <Table>
            <TableHeader><TableRow><TableHead>Гишүүн</TableHead><TableHead>Гүйлгээ</TableHead><TableHead>Дүн</TableHead><TableHead>Төрөл</TableHead></TableRow></TableHeader>
            <TableBody>
              {table.visible.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.Member?.name}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell className={t.amount > 0 ? "text-emerald-400" : ""}>{tugrik(t.amount)}</TableCell>
                  <TableCell>{t.kind}</TableCell>
                </TableRow>
              ))}
              {table.visible.length === 0 && <TableEmpty colSpan={4}>Гүйлгээ алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>
        </CardContent>
      </Card>
    </Shell>
  );
}
