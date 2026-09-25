"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Ban, CheckCircle2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { formatDateTime, formatHf, formatPoints, type ScoreDetail } from "@/lib/scoring";
import { ScoreStatusBadge } from "./ui";

const DIFF_FIELDS: [string, string][] = [
  ["alphaHits", "A"],
  ["charlieHits", "C"],
  ["deltaHits", "D"],
  ["missCount", "M"],
  ["noShootCount", "NS"],
  ["proceduralCount", "Proc"],
  ["otherPenaltyPoints", "Бусад торгууль"],
  ["timeSeconds", "Хугацаа"],
  ["hitFactor", "HF"],
  ["status", "Төлөв"],
];

function Metric({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-lg border border-border p-2 text-center">
      <div className="text-[11px] text-muted-foreground uppercase">{label}</div>
      <div className={`font-heading text-xl ${tone || ""}`}>{value}</div>
    </div>
  );
}

export function ScoreDrawer({
  scoreId,
  onClose,
  onChanged,
  canManage,
}: {
  scoreId: string | null;
  onClose: () => void;
  onChanged: () => void;
  canManage: boolean;
}) {
  const [detail, setDetail] = useState<ScoreDetail | null>(null);
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"idle" | "invalidate" | "sign">("idle");
  const [busy, setBusy] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(scoreId);

  if (scoreId !== currentId) {
    setCurrentId(scoreId);
    setDetail(null);
    setReason("");
    setMode("idle");
  }

  useEffect(() => {
    if (!currentId) return;
    let cancelled = false;
    api<ScoreDetail>(`/api/admin/scoring/scores/${currentId}`)
      .then((d) => !cancelled && setDetail(d))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [currentId]);

  async function reload() {
    if (!currentId) return;
    setDetail(await api<ScoreDetail>(`/api/admin/scoring/scores/${currentId}`));
  }

  async function submit() {
    if (!currentId) return;
    if (mode === "invalidate" && !reason.trim()) {
      toast.error("Шалтгаан оруулна уу");
      return;
    }
    setBusy(true);
    try {
      await api(`/api/admin/scoring/scores/${currentId}/${mode === "invalidate" ? "invalidate" : "sign"}`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      toast.success(mode === "invalidate" ? "Оноог хүчингүй болголоо" : "Оноог баталгаажууллаа");
      setMode("idle");
      setReason("");
      await reload();
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setBusy(false);
    }
  }

  const s = detail?.score;
  const canSign = canManage && s && (s.status === "ENTERED" || s.status === "CONFIRMED");
  const canInvalidate = canManage && s && s.status !== "INVALIDATED";

  return (
    <Sheet open={!!scoreId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            {s?.competitor?.name || "Оноо"}
            {s && <ScoreStatusBadge status={s.status} />}
          </SheetTitle>
          <SheetDescription>
            {s ? `Стейж ${s.stageNumber ?? "?"} · ${s.stageName ?? ""} · ${s.competitor?.divisionName ?? "—"} · ${s.competitor?.squadName ?? "—"}` : "Ачаалж байна…"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {!detail && <div className="text-sm text-muted-foreground">Ачаалж байна…</div>}
          {s && detail && (
            <>
              <section className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Metric label="Hit factor" value={formatHf(s.hitFactor)} tone="text-primary" />
                  <Metric label="Хугацаа" value={`${s.timeSeconds.toFixed(2)}s`} />
                  <Metric label="Оноо" value={s.effectivePoints} />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  <Metric label="A" value={s.alphaHits} />
                  <Metric label="C" value={s.charlieHits} />
                  <Metric label="D" value={s.deltaHits} />
                  <Metric label="M" value={s.missCount} tone={s.missCount ? "text-destructive" : ""} />
                  <Metric label="NS" value={s.noShootCount} tone={s.noShootCount ? "text-destructive" : ""} />
                  <Metric label="Proc" value={s.proceduralCount} tone={s.proceduralCount ? "text-destructive" : ""} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-muted/40 p-3 text-sm">
                  <span className="text-muted-foreground">Цохилтын оноо</span>
                  <span className="text-right">{s.hitPoints}</span>
                  <span className="text-muted-foreground">Торгууль</span>
                  <span className="text-right text-destructive">−{s.penaltyPoints + (s.otherPenaltyPoints || 0)}</span>
                  <span className="text-muted-foreground">Торгуулийн дараа</span>
                  <span className="text-right">{s.pointsAfterPenalty}</span>
                  {detail.stage && (
                    <>
                      <span className="text-muted-foreground">Стейжийн дээд оноо</span>
                      <span className="text-right">{detail.stage.maximumPoints}</span>
                    </>
                  )}
                </div>
              </section>

              {detail.stageResult && s.status === "SIGNED" && (
                <section className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
                  <div className="mb-2 font-medium">Стейжийн үр дүн (ангилалдаа)</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div><div className="text-xs text-muted-foreground">Байр</div><div className="font-heading text-xl">#{detail.stageResult.rank}</div></div>
                    <div><div className="text-xs text-muted-foreground">Стейж оноо</div><div className="font-heading text-xl">{formatPoints(detail.stageResult.stagePoints)}</div></div>
                    <div><div className="text-xs text-muted-foreground">Хувь</div><div className="font-heading text-xl">{formatPoints(detail.stageResult.stagePercentage)}%</div></div>
                    <div><div className="text-xs text-muted-foreground">Шилдэг HF</div><div className="font-heading text-xl">{formatHf(detail.stageResult.bestHitFactor)}</div></div>
                  </div>
                </section>
              )}

              <section className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Гишүүний код</span>
                <span className="text-right font-mono">{s.competitor?.memberCode || "—"}</span>
                <span className="text-muted-foreground">Bib</span>
                <span className="text-right">{s.competitor?.bibNumber || "—"}</span>
                <span className="text-muted-foreground">Оруулсан</span>
                <span className="text-right">{s.enteredBy?.name || "—"} · {formatDateTime(s.createdAt)}</span>
                <span className="text-muted-foreground">Баталгаажсан</span>
                <span className="text-right">{s.signedAt ? `${s.signedBy?.name || "Тамирчин"} · ${formatDateTime(s.signedAt)}` : "—"}</span>
                <span className="text-muted-foreground">Төхөөрөмж</span>
                <span className="text-right font-mono text-xs">{s.deviceId || "—"}</span>
                <span className="text-muted-foreground">Хувилбар</span>
                <span className="text-right">v{s.version}</span>
              </section>

              {detail.otherAttempts.length > 0 && (
                <section className="space-y-2">
                  <div className="text-sm font-medium">Энэ стейжийн бусад бичлэг</div>
                  {detail.otherAttempts.map((o) => (
                    <div key={o.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ScoreStatusBadge status={o.status} />
                        <span>HF {formatHf(o.hitFactor)} · {o.timeSeconds.toFixed(2)}s</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(o.updatedAt)}</span>
                    </div>
                  ))}
                </section>
              )}

              <section className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium"><History className="size-4" /> Түүх</div>
                {detail.history.length === 0 && detail.revisions.length === 0 && (
                  <div className="text-sm text-muted-foreground">Түүх алга.</div>
                )}
                <ol className="space-y-2 border-l border-border pl-4">
                  {detail.history.map((h) => (
                    <li key={h.id} className="relative text-sm">
                      <span className="absolute top-1.5 -left-[21px] size-2.5 rounded-full bg-primary" />
                      <div className="font-medium">{h.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {h.actor?.name || "Тамирчин / төхөөрөмж"} · {formatDateTime(h.createdAt)}
                        {h.deviceId ? ` · ${h.deviceId}` : ""}
                      </div>
                      {h.reason && <div className="mt-1 rounded bg-muted px-2 py-1 text-xs">Шалтгаан: {h.reason}</div>}
                    </li>
                  ))}
                </ol>
                {detail.revisions.map((r) => {
                  const changes = DIFF_FIELDS.filter(([key]) => String(r.oldData?.[key] ?? "") !== String(r.newData?.[key] ?? ""));
                  return (
                    <div key={r.id} className="rounded-lg border border-border p-3 text-sm">
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>Засвар #{r.revisionNumber} · {r.changedBy?.name || "—"}</span>
                        <span>{formatDateTime(r.createdAt)}</span>
                      </div>
                      {changes.length === 0 ? (
                        <div className="text-xs text-muted-foreground">Өөрчлөлтгүй</div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {changes.map(([key, label]) => (
                            <span key={key} className="rounded bg-muted px-2 py-0.5 text-xs">
                              {label}: <s className="text-muted-foreground">{String(r.oldData?.[key] ?? "—")}</s> → <b>{String(r.newData?.[key] ?? "—")}</b>
                            </span>
                          ))}
                        </div>
                      )}
                      {r.reason && <div className="mt-1 text-xs">Шалтгаан: {r.reason}</div>}
                    </div>
                  );
                })}
              </section>

              {mode !== "idle" && (
                <section className="space-y-2 rounded-lg border border-border p-3">
                  <Label>{mode === "invalidate" ? "Хүчингүй болгох шалтгаан *" : "Тайлбар (заавал биш)"}</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={mode === "invalidate" ? "Жишээ: Буруу стейжид оруулсан, дахин буудна" : "Жишээ: Тамирчин байхгүй, RO баталгаажуулав"}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setMode("idle")}>Болих</Button>
                    <Button variant={mode === "invalidate" ? "destructive" : "default"} disabled={busy} onClick={submit}>
                      {mode === "invalidate" ? "Хүчингүй болгох" : "Баталгаажуулах"}
                    </Button>
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {(canSign || canInvalidate) && mode === "idle" && (
          <SheetFooter className="flex-row justify-end border-t border-border">
            {canInvalidate && (
              <Button variant="destructive" onClick={() => setMode("invalidate")}>
                <Ban className="size-4" /> Хүчингүй болгох
              </Button>
            )}
            {canSign && (
              <Button onClick={() => setMode("sign")}>
                <CheckCircle2 className="size-4" /> Админаар баталгаажуулах
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
