"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FieldSelect } from "@/components/field-select";

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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  async function load() {
    setItems((await api<{ orders: Order[] }>("/api/admin/orders")).orders);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (o) =>
          (!status || o.status === status) &&
          matchesQuery(query, [o.Member?.name, o.Member?.memberCode, o.status, ...(o.items || []).map((i) => i.name)])
      ),
    [items, query, status]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${status}` });

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Захиалга</h1>
      <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Гишүүн, бараа..."
            unit="захиалга"
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
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="fulfilled">fulfilled</option>
                  <option value="cancelled">cancelled</option>
                </FieldSelect>
              </FilterField>
            }
          >
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
              {table.visible.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.Member?.name}<div className="text-xs text-muted-foreground">{o.Member?.memberCode}</div></TableCell>
                  <TableCell>{(o.items || []).map((i) => `${i.name} ×${i.quantity}`).join(", ")}</TableCell>
                  <TableCell>{tugrik(o.total)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell>
                    <ActionCell>
                      <IconActionButton
                        action="deliver"
                        onClick={async () => {
                          await api(`/api/admin/orders/${o.id}`, { method: "PUT", body: JSON.stringify({ status: "fulfilled" }) });
                          load();
                        }}
                      />
                    </ActionCell>
                  </TableCell>
                </TableRow>
              ))}
                {table.visible.length === 0 && <TableEmpty colSpan={5}>Захиалга алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>
    </Shell>
  );
}
