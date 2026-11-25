"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type MatchType = { id: string; name: string; comment?: string };
type Division = { id: string; abbreviation: string; name: string; description?: string };

const emptyType = { name: "", comment: "" };
const emptyDivision = { abbreviation: "", name: "", description: "" };

export default function MatchSetupPage() {
  const canTypes = can("match_types.manage");
  const canDivs = can("divisions.manage");
  const [tab, setTab] = useState("types");

  const [types, setTypes] = useState<MatchType[]>([]);
  const [typeQuery, setTypeQuery] = useState("");
  const [typeForm, setTypeForm] = useState(emptyType);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeSaving, setTypeSaving] = useState(false);

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [divQuery, setDivQuery] = useState("");
  const [divForm, setDivForm] = useState(emptyDivision);
  const [editingDiv, setEditingDiv] = useState<string | null>(null);
  const [divOpen, setDivOpen] = useState(false);
  const [divSaving, setDivSaving] = useState(false);

  async function loadTypes() {
    const data = await api<{ matchTypes: MatchType[] }>("/api/admin/match-types");
    setTypes(data.matchTypes);
  }

  async function loadDivisions() {
    const data = await api<{ divisions: Division[] }>("/api/admin/divisions");
    setDivisions(data.divisions);
  }

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (requested === "divisions" && can("divisions.manage")) setTab("divisions");
    else if (!can("match_types.manage") && can("divisions.manage")) setTab("divisions");
    if (can("match_types.manage")) loadTypes().catch((e) => toast.error(e.message));
    if (can("divisions.manage")) loadDivisions().catch((e) => toast.error(e.message));
  }, []);

  const typeTable = useClientTable(
    useMemo(() => types.filter((item) => matchesQuery(typeQuery, [item.name, item.comment])), [types, typeQuery]),
    { resetKey: typeQuery }
  );
  const divTable = useClientTable(
    useMemo(
      () => divisions.filter((item) => matchesQuery(divQuery, [item.abbreviation, item.name, item.description])),
      [divisions, divQuery]
    ),
    { resetKey: divQuery }
  );

  function setActiveTab(next: string) {
    setTab(next);
    window.history.replaceState(null, "", next === "divisions" ? "/match-types?tab=divisions" : "/match-types");
  }

  function closeType() {
    setTypeOpen(false);
    setEditingType(null);
    setTypeForm(emptyType);
  }

  function closeDiv() {
    setDivOpen(false);
    setEditingDiv(null);
    setDivForm(emptyDivision);
  }

  async function saveType() {
    if (!typeForm.name.trim()) return toast.error("Нэр оруулна уу.");
    setTypeSaving(true);
    try {
      if (editingType) {
        await api(`/api/admin/match-types/${editingType}`, { method: "PUT", body: JSON.stringify(typeForm) });
      } else {
        await api("/api/admin/match-types", { method: "POST", body: JSON.stringify(typeForm) });
      }
      toast.success("Хадгаллаа");
      closeType();
      await loadTypes();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setTypeSaving(false);
    }
  }

  async function saveDivision() {
    if (!divForm.abbreviation.trim() || !divForm.name.trim()) return toast.error("Товчлол, нэр оруулна уу.");
    setDivSaving(true);
    try {
      if (editingDiv) {
        await api(`/api/admin/divisions/${editingDiv}`, { method: "PUT", body: JSON.stringify(divForm) });
      } else {
        await api("/api/admin/divisions", { method: "POST", body: JSON.stringify(divForm) });
      }
      toast.success("Хадгаллаа");
      closeDiv();
      await loadDivisions();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setDivSaving(false);
    }
  }

  const showTabs = canTypes && canDivs;

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Төрөл, ангилал</h1>
          <p className="text-sm text-muted-foreground">Тоглолтын төрөл болон ангиллыг эндээс нэмж, засварлана.</p>
        </div>
        {tab === "divisions" ? (
          canDivs && (
            <Button onClick={() => { closeDiv(); setDivOpen(true); }}>
              <Plus className="size-4" /> Шинэ ангилал
            </Button>
          )
        ) : (
          canTypes && (
            <Button onClick={() => { closeType(); setTypeOpen(true); }}>
              <Plus className="size-4" /> Шинэ төрөл
            </Button>
          )
        )}
      </div>

      <Tabs value={tab} onValueChange={(value) => setActiveTab(String(value))} className="gap-4">
        {showTabs && (
          <TabsList variant="line" className="mb-2">
            <TabsTrigger value="types">Тоглолтын төрөл</TabsTrigger>
            <TabsTrigger value="divisions">Ангилал</TabsTrigger>
          </TabsList>
        )}

        {canTypes && (
          <TabsContent value="types">
            <DataTable
              search={typeQuery}
              onSearchChange={setTypeQuery}
              searchPlaceholder="Төрөл хайх..."
              unit="төрөл"
              total={typeTable.total}
              page={typeTable.page}
              pageCount={typeTable.pageCount}
              onPageChange={typeTable.setPage}
              pageSize={typeTable.pageSize}
              onPageSizeChange={typeTable.setPageSize}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Нэр</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typeTable.visible.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.comment || "—"}</TableCell>
                      <TableCell>
                        <ActionCell>
                          <IconActionButton
                            action="edit"
                            onClick={() => {
                              setEditingType(item.id);
                              setTypeForm({ name: item.name, comment: item.comment || "" });
                              setTypeOpen(true);
                            }}
                          />
                          <IconActionButton
                            action="delete"
                            onClick={async () => {
                              if (!confirm("Устгах уу?")) return;
                              await api(`/api/admin/match-types/${item.id}`, { method: "DELETE" });
                              loadTypes();
                            }}
                          />
                        </ActionCell>
                      </TableCell>
                    </TableRow>
                  ))}
                  {typeTable.visible.length === 0 && <TableEmpty colSpan={3}>Тоглолтын төрөл алга.</TableEmpty>}
                </TableBody>
              </Table>
            </DataTable>
          </TabsContent>
        )}

        {canDivs && (
          <TabsContent value="divisions">
            <DataTable
              search={divQuery}
              onSearchChange={setDivQuery}
              searchPlaceholder="Ангилал хайх..."
              unit="ангилал"
              total={divTable.total}
              page={divTable.page}
              pageCount={divTable.pageCount}
              onPageChange={divTable.setPage}
              pageSize={divTable.pageSize}
              onPageSizeChange={divTable.setPageSize}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товчлол</TableHead>
                    <TableHead>Нэр</TableHead>
                    <TableHead>Тайлбар</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {divTable.visible.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.abbreviation}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description || "—"}</TableCell>
                      <TableCell>
                        <ActionCell>
                          <IconActionButton
                            action="edit"
                            onClick={() => {
                              setEditingDiv(item.id);
                              setDivForm({
                                abbreviation: item.abbreviation,
                                name: item.name,
                                description: item.description || "",
                              });
                              setDivOpen(true);
                            }}
                          />
                          <IconActionButton
                            action="delete"
                            onClick={async () => {
                              if (!confirm("Устгах уу?")) return;
                              await api(`/api/admin/divisions/${item.id}`, { method: "DELETE" });
                              loadDivisions();
                            }}
                          />
                        </ActionCell>
                      </TableCell>
                    </TableRow>
                  ))}
                  {divTable.visible.length === 0 && <TableEmpty colSpan={4}>Ангилал алга.</TableEmpty>}
                </TableBody>
              </Table>
            </DataTable>
          </TabsContent>
        )}
      </Tabs>

      <FormDrawer
        open={typeOpen}
        onOpenChange={(next) => { if (!next) closeType(); else setTypeOpen(true); }}
        title={editingType ? "Төрөл засах" : "Шинэ төрөл"}
        footer={
          <>
            <Button variant="outline" onClick={closeType}>Болих</Button>
            <Button onClick={saveType} disabled={typeSaving}>
              {typeSaving ? "Хадгалж байна..." : editingType ? "Шинэчлэх" : "Үүсгэх"}
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={typeForm.name} onChange={(e) => setTypeForm({ ...typeForm, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Comment</Label>
          <Textarea value={typeForm.comment} onChange={(e) => setTypeForm({ ...typeForm, comment: e.target.value })} />
        </div>
      </FormDrawer>

      <FormDrawer
        open={divOpen}
        onOpenChange={(next) => { if (!next) closeDiv(); else setDivOpen(true); }}
        title={editingDiv ? "Ангилал засах" : "Шинэ ангилал"}
        footer={
          <>
            <Button variant="outline" onClick={closeDiv}>Болих</Button>
            <Button onClick={saveDivision} disabled={divSaving}>
              {divSaving ? "Хадгалж байна..." : editingDiv ? "Шинэчлэх" : "Үүсгэх"}
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>Товчлол</Label>
          <Input autoFocus value={divForm.abbreviation} onChange={(e) => setDivForm({ ...divForm, abbreviation: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input value={divForm.name} onChange={(e) => setDivForm({ ...divForm, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Тайлбар</Label>
          <Textarea value={divForm.description} onChange={(e) => setDivForm({ ...divForm, description: e.target.value })} />
        </div>
      </FormDrawer>
    </Shell>
  );
}
