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
const ACTIVE_STATUSES = new Set(["planning", "advertised", "tendering", "implementation"]);

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

function formatNaira(total: number): string {
  if (total >= 1_000_000_000) return `\u20A6${(total / 1_000_000_000).toFixed(1)}bn`;
  if (total >= 1_000_000) return `\u20A6${(total / 1_000_000).toFixed(1)}m`;
  if (total >= 1_000) return `\u20A6${(total / 1_000).toFixed(0)}k`;
  return `\u20A6${total.toFixed(0)}`;
}

export async function getRegisterStats(): Promise<RegisterStats> {
  try {
    const res = await fetch(`${API_BASE}/export/data.json`, {
      // Render's free tier can cold-start slowly; give it real time,
      // but don't hang the page build forever if it's actually down.
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 300 }, // cache 5 min so we're not hammering a free-tier instance
    });

    if (!res.ok) throw new Error(`Export endpoint responded ${res.status}`);

    const data: { records: ProcurementRecord[] } = await res.json();
    const records = data.records ?? [];

    const totalValue = records.reduce((sum, r) => {
      const value = r.awarded_cost ?? r.estimated_cost;
      const parsed = Number.parseFloat(value);
      return sum + (Number.isFinite(parsed) ? parsed : 0);
    }, 0);

    return {
      totalProjects: records.length,
      activeProjects: records.filter((r) => ACTIVE_STATUSES.has(r.status.toLowerCase())).length,
      totalValueLabel: formatNaira(totalValue),
      isLive: true,
    };
  } catch {
    // Covers: Render instance asleep/cold-starting, network error, bad JSON.
    // The landing page should never break because the free-tier API is napping.
    return FALLBACK_STATS;
  }
}
