// Talks to the existing Django open-data endpoint:
//   GET {API_BASE}/export/data.json  ->  { records: ProcurementRecord[] }
// No auth, no more data than the public dashboard already shows.

export type ProcurementRecord = {
  id: string;
  title: string;
  department: string;
  budget_source: string;
  estimated_cost: string; // decimal-as-string from Django
  awarded_cost: string | null;
  procurement_method: string;
  vendor_name: string | null;
  status: string;
  location: string;
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  created_at: string;
  updated_at: string;
};

// Statuses that count as "still moving" vs. settled/closed.
// Mirrors ProcurementRecord.Status in procurement/models.py.
const ACTIVE_STATUSES = new Set([
  "planning",
  "advertised",
  "tendering",
  "awarded",
  "implementation",
]);
const FLAGGED_STATUSES = new Set([
  "abandoned",
  "cancelled",
  "canceled",
  "terminated",
  "disputed",
  "flagged",
]);

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://prodap.onrender.com";

export type RegisterStats = {
  totalProjects: number;
  activeProjects: number;
  totalValueLabel: string; // pre-formatted, e.g. "₦2.4bn"
  isLive: boolean; // false when the fetch failed and we're showing placeholders
};

const FALLBACK_STATS: RegisterStats = {
  totalProjects: 142,
  activeProjects: 37,
  totalValueLabel: "\u20A62.4bn",
  isLive: false,
};

export function formatNaira(total: number): string {
  if (total >= 1_000_000_000) return `\u20A6${(total / 1_000_000_000).toFixed(1)}bn`;
  if (total >= 1_000_000) return `\u20A6${(total / 1_000_000).toFixed(1)}m`;
  if (total >= 1_000) return `\u20A6${(total / 1_000).toFixed(0)}k`;
  return `\u20A6${total.toFixed(0)}`;
}

// Awarded cost is the source of truth once a contract is signed; estimated
// cost is the best figure available before that.
export function recordCost(record: ProcurementRecord): number {
  const value = record.awarded_cost ?? record.estimated_cost;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export type StatusTone = "active" | "flagged" | "settled";

export function statusTone(status: string): StatusTone {
  const s = status.toLowerCase();
  if (FLAGGED_STATUSES.has(s)) return "flagged";
  if (ACTIVE_STATUSES.has(s)) return "active";
  return "settled";
}

// Django already serves a full public detail page for each record — status
// history, contract/milestones/payments, bids, complaints, plus the
// flag/ask/complain forms. Rebuilding that in Next.js off the flat export
// feed would mean re-deriving disclosure-timing rules that already live
// there, so the register links straight to it instead of duplicating it.
export function recordDetailUrl(id: string): string {
  return `${API_BASE}/projects/${id}/`;
}

export function formatDateRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? null
      : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  };
  const s = fmt(start);
  if (!s) return "Date not set";
  const e = fmt(end);
  return e ? `${s} \u2013 ${e}` : s;
}

async function fetchExportData(): Promise<{ records: ProcurementRecord[]; isLive: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/export/data.json`, {
      // Render's free tier can cold-start slowly; give it real time,
      // but don't hang the page build forever if it's actually down.
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 300 }, // cache 5 min so we're not hammering a free-tier instance
    });

    if (!res.ok) throw new Error(`Export endpoint responded ${res.status}`);

    const data: { records: ProcurementRecord[] } = await res.json();
    return { records: data.records ?? [], isLive: true };
  } catch {
    // Covers: Render instance asleep/cold-starting, network error, bad JSON.
    return { records: [], isLive: false };
  }
}

export async function getRegisterStats(): Promise<RegisterStats> {
  const { records, isLive } = await fetchExportData();
  // The landing page should never break because the free-tier API is napping.
  if (!isLive) return FALLBACK_STATS;

  const totalValue = records.reduce((sum, r) => sum + recordCost(r), 0);

  return {
    totalProjects: records.length,
    activeProjects: records.filter((r) => ACTIVE_STATUSES.has(r.status.toLowerCase())).length,
    totalValueLabel: formatNaira(totalValue),
    isLive: true,
  };
}

export async function getRegisterRecords(): Promise<{
  records: ProcurementRecord[];
  isLive: boolean;
}> {
  return fetchExportData();
}
