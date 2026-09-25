"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { PlayCircle, RefreshCw } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/scoring/overview-tab";
import { DEFAULT_SCORE_FILTERS, ScoresTab, type ScoreFilters } from "@/components/scoring/scores-tab";
import { MatrixTab } from "@/components/scoring/matrix-tab";
import { ResultsTab } from "@/components/scoring/results-tab";
import { SetupTab } from "@/components/scoring/setup-tab";
import { ScoreDrawer } from "@/components/scoring/score-drawer";
import { api } from "@/lib/api";
import { can } from "@/lib/auth";
import { MATCH_STATUS_LABEL, type ScoringOverview } from "@/lib/scoring";
import { cn } from "@/lib/utils";

const TRIGGER = "h-10 flex-none px-4 text-sm sm:text-base";

export default function CompetitionScoringPage() {
  const { id } = useParams<{ id: string }>();
  const [overview, setOverview] = useState<ScoringOverview | null>(null);
  const [tab, setTab] = useState("overview");
  const [filters, setFilters] = useState<ScoreFilters>(DEFAULT_SCORE_FILTERS);
  const [filtersKey, setFiltersKey] = useState(0);
  const [openScore, setOpenScore] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [settingUp, setSettingUp] = useState(false);
  const canManage = can("scoring.manage") || can("competitions.manage");

  useEffect(() => {
    let cancelled = false;
    api<ScoringOverview>(`/api/admin/competitions/${id}/scoring`)
      .then((data) => !cancelled && setOverview(data))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [id, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  async function setup() {
    setSettingUp(true);
    try {
      const r = await api<{ imported: number; eligible: number }>(`/api/admin/competitions/${id}/scoring/setup`, { method: "POST" });
      toast.success(`Оноо тооцоолол идэвхжлээ · ${r.imported} оролцогч нэмэгдлээ`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSettingUp(false);
    }
  }

  function openScores(next: Partial<ScoreFilters>) {
    setFilters({ ...DEFAULT_SCORE_FILTERS, ...next });
    setFiltersKey((k) => k + 1);
    setTab("scores");
  }

  const title = overview?.competition.title || "Тэмцээн";
  const match = overview?.match;

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href={`/competitions/${id}`} className="text-sm text-muted-foreground hover:text-primary">← {title}</Link>
          <h1 className="font-heading text-3xl text-primary">Оноо & үр дүн</h1>
          <p className="text-sm text-muted-foreground">
            {overview?.competition.eventDate ? String(overview.competition.eventDate).slice(0, 10) : ""}
            {overview?.competition.location ? ` · ${overview.competition.location}` : ""}
            {match && (
              <span
                className={cn(
                  "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                  match.status === "FINAL" ? "bg-emerald-500/15 text-emerald-500" : "bg-primary/10 text-primary"
                )}
              >
                {MATCH_STATUS_LABEL[match.status]}
              </span>
            )}
          </p>
        </div>
        {match && (
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="size-4" /> Шинэчлэх
          </Button>
        )}
      </div>

      {!overview && <div className="text-sm text-muted-foreground">Ачаалж байна…</div>}

      {overview && !match && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <PlayCircle className="size-12 text-primary" />
            <div className="space-y-1">
              <div className="font-heading text-2xl">Оноо тооцоолол эхлээгүй байна</div>
              <p className="max-w-md text-sm text-muted-foreground">
                Энэ тэмцээнд стейж, скуад, оролцогчийн жагсаалт үүсээгүй байна. Эхлүүлбэл төлбөр төлсөн{" "}
                <b>{overview.registrations.eligible}</b> бүртгэлээс оролцогч үүсч, score app-аар оноо оруулах боломжтой болно.
              </p>
            </div>
            {canManage && (
              <Button disabled={settingUp} onClick={setup}>
                <PlayCircle className="size-4" /> Оноо тооцоолол эхлүүлэх
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {overview && match && (
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="gap-4">
          <TabsList variant="line" className="mb-4 h-auto w-full flex-wrap items-center justify-start gap-2 border-b border-border pb-3">
            <TabsTrigger value="overview" className={TRIGGER}>Хяналт</TabsTrigger>
            <TabsTrigger value="scores" className={TRIGGER}>
              Баталгаажсан оноо
              <span className="rounded-full bg-emerald-500/15 px-2 text-xs text-emerald-500">{overview.stats?.signed ?? 0}</span>
            </TabsTrigger>
            <TabsTrigger value="matrix" className={TRIGGER}>Матриц</TabsTrigger>
            <TabsTrigger value="results" className={TRIGGER}>Үр дүн</TabsTrigger>
            <TabsTrigger value="setup" className={TRIGGER}>Стейж & оролцогч</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab overview={overview} canManage={canManage} onChanged={refresh} onOpenScores={openScores} />
          </TabsContent>
          <TabsContent value="scores">
            <ScoresTab
              key={filtersKey}
              competitionId={id}
              competitionTitle={title}
              filters={filters}
              setFilters={setFilters}
              onOpen={setOpenScore}
              refreshKey={refreshKey}
            />
          </TabsContent>
          <TabsContent value="matrix">
            <MatrixTab competitionId={id} onOpen={setOpenScore} refreshKey={refreshKey} />
          </TabsContent>
          <TabsContent value="results">
            <ResultsTab competitionId={id} competitionTitle={title} refreshKey={refreshKey} />
          </TabsContent>
          <TabsContent value="setup">
            <SetupTab
              competitionId={id}
              matchId={match.id}
              stages={overview.stages || []}
              canManage={canManage}
              onChanged={refresh}
              refreshKey={refreshKey}
            />
          </TabsContent>
        </Tabs>
      )}

      <ScoreDrawer scoreId={openScore} onClose={() => setOpenScore(null)} onChanged={refresh} canManage={canManage} />
    </Shell>
  );
}
