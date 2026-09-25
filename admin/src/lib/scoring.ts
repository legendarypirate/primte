export type ScoreStatus = "DRAFT" | "ENTERED" | "CONFIRMED" | "SIGNED" | "INVALIDATED";
export type MatchStatus = "DRAFT" | "REGISTRATION" | "ACTIVE" | "SCORING_COMPLETE" | "PROVISIONAL" | "FINAL";
export type CompetitorStatus = "ACTIVE" | "WITHDRAWN" | "DQ";

export type Person = { id: string; name: string } | null;

export type ScoringMatch = {
  id: string;
  name: string;
  status: MatchStatus;
  discipline?: string;
  scoringProfileId: string;
  startDate?: string;
  endDate?: string;
  location?: string;
};

export type ScoringStage = {
  id: string;
  number: number;
  name: string;
  courseType: "SHORT" | "MEDIUM" | "LONG" | "CUSTOM";
  minimumRounds: number;
  maximumPoints: number;
  paperTargetCount: number;
  metalTargetCount: number;
  noShootCount: number;
  status: "WAITING" | "ACTIVE" | "COMPLETED";
};

export type ScoringCompetitor = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  bibNumber?: string | null;
  memberId: string;
  memberCode?: string | null;
  avatarUrl?: string | null;
  status: CompetitorStatus;
  powerFactor: "MAJOR" | "MINOR" | "NONE";
  divisionId?: string | null;
  divisionName?: string | null;
  squadId?: string | null;
  squadName?: string | null;
};

export type ScoreRow = {
  id: string;
  status: ScoreStatus;
  stageId: string;
  stageNumber: number | null;
  stageName: string | null;
  competitor: ScoringCompetitor | null;
  alphaHits: number;
  charlieHits: number;
  deltaHits: number;
  missCount: number;
  noShootCount: number;
  proceduralCount: number;
  otherPenaltyPoints: number;
  timeSeconds: number;
  hitPoints: number;
  penaltyPoints: number;
  pointsAfterPenalty: number;
  effectivePoints: number;
  hitFactor: number;
  enteredBy: Person;
  signedBy: Person;
  signedAt?: string | null;
  deviceId?: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type Option = { id: string; name: string; code?: string; number?: number };

export type ScoringOverview = {
  competition: { id: string; title: string; eventDate?: string; location?: string; status: string };
  match: ScoringMatch | null;
  registrations: { eligible: number; imported: number; pending: number };
  stats?: {
    competitors: { total: number; active: number; dq: number; withdrawn: number };
    scores: Record<ScoreStatus, number>;
    signed: number;
    pending: number;
    expected: number;
    progress: number;
  };
  stages?: (ScoringStage & {
    signed: number;
    pending: number;
    invalidated: number;
    expected: number;
    progress: number;
    topHitFactor: number;
  })[];
  squads?: { id: string; name: string; status: string; competitors: number; signed: number; expected: number; progress: number }[];
  divisions?: {
    id: string;
    name: string;
    code: string;
    competitors: number;
    active: number;
    leader: { competitorId: string; name: string; matchPoints: number } | null;
  }[];
  activity?: {
    id: string;
    action: string;
    label: string;
    entityType: string;
    entityId: string;
    subject: string | null;
    reason: string | null;
    actor: Person;
    deviceId?: string | null;
    createdAt: string;
  }[];
};

export type ScoreDetail = {
  score: ScoreRow;
  stage: ScoringStage | null;
  stageResult: { hitFactor: number; bestHitFactor: number; stagePoints: number; stagePercentage: number; rank: number } | null;
  revisions: {
    id: string;
    revisionNumber: number;
    oldData: Record<string, unknown>;
    newData: Record<string, unknown>;
    reason?: string | null;
    changedBy: Person;
    createdAt: string;
  }[];
  history: { id: string; action: string; label: string; reason: string | null; actor: Person; deviceId?: string | null; createdAt: string }[];
  otherAttempts: ScoreRow[];
};

export type StageCell = { hitFactor: number; stagePoints: number; stagePercentage: number; rank: number };

export type ResultsResponse = {
  match: ScoringMatch | null;
  stages: ScoringStage[];
  divisions: {
    id: string;
    name: string;
    code: string;
    rows: {
      rank: number;
      competitor: ScoringCompetitor;
      matchPoints: number;
      matchPercentage: number;
      stages: Record<string, StageCell>;
      stagesCompleted: number;
    }[];
    unranked: { competitor: ScoringCompetitor; reason: string }[];
  }[];
};

export type MatrixResponse = {
  stages: ScoringStage[];
  squads: Option[];
  divisions: Option[];
  rows: {
    competitor: ScoringCompetitor;
    cells: Record<string, { scoreId: string; status: ScoreStatus; hitFactor: number; timeSeconds: number }>;
    signed: number;
    total: number;
  }[];
};

export const SCORE_STATUS_LABEL: Record<ScoreStatus, string> = {
  DRAFT: "Ноорог",
  ENTERED: "Оруулсан",
  CONFIRMED: "Шалгасан",
  SIGNED: "Баталгаажсан",
  INVALIDATED: "Хүчингүй",
};

export const SCORE_STATUS_CLASS: Record<ScoreStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  ENTERED: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CONFIRMED: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  SIGNED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  INVALIDATED: "bg-destructive/15 text-destructive line-through",
};

export const MATCH_STATUS_LABEL: Record<MatchStatus, string> = {
  DRAFT: "Ноорог",
  REGISTRATION: "Бүртгэл",
  ACTIVE: "Явагдаж байна",
  SCORING_COMPLETE: "Оноо дууссан",
  PROVISIONAL: "Урьдчилсан дүн",
  FINAL: "Эцсийн дүн",
};

export const COMPETITOR_STATUS_LABEL: Record<CompetitorStatus, string> = {
  ACTIVE: "Идэвхтэй",
  WITHDRAWN: "Гарсан",
  DQ: "DQ",
};

export function formatHf(value: number) {
  return Number(value || 0).toFixed(4);
}

export function formatPoints(value: number) {
  return Number(value || 0).toFixed(2);
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("mn-MN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function downloadCsv(filename: string, rows: (string | number | null | undefined)[][]) {
  const escape = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "\uFEFF" + rows.map((r) => r.map(escape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
