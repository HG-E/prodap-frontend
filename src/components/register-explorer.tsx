"use client";

import { useMemo, useState } from "react";
import {
  type ProcurementRecord,
  type StatusTone,
  formatDateRange,
  formatNaira,
  recordCost,
  recordDetailUrl,
  statusTone,
} from "@/lib/prodap";

type SortKey = "recent" | "cost-desc" | "cost-asc";

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Most recent",
  "cost-desc": "Cost: high to low",
  "cost-asc": "Cost: low to high",
};

const TONE_STYLES: Record<StatusTone, string> = {
  active: "bg-seal-tint text-seal",
  flagged: "bg-flag-tint text-flag",
  settled: "bg-line/50 text-ink-muted",
};

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RegisterExplorer({ records }: { records: ProcurementRecord[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<SortKey>("recent");

  const departments = useMemo(
    () => Array.from(new Set(records.map((r) => r.department))).sort((a, b) => a.localeCompare(b)),
    [records],
  );
  const statuses = useMemo(
    () => Array.from(new Set(records.map((r) => r.status))).sort((a, b) => a.localeCompare(b)),
    [records],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = records.filter((r) => {
      if (department !== "all" && r.department !== department) return false;
      if (status !== "all" && r.status !== status) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        (r.vendor_name?.toLowerCase().includes(q) ?? false)
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "cost-desc") return recordCost(b) - recordCost(a);
      if (sort === "cost-asc") return recordCost(a) - recordCost(b);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [records, query, department, status, sort]);

  const hasFilters = query !== "" || department !== "all" || status !== "all";

  function clearFilters() {
    setQuery("");
    setDepartment("all");
    setStatus("all");
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by project, department, or vendor…"
          className="flex-1 rounded-[8px] border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
        <div className="flex gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="min-w-0 rounded-[8px] border border-line bg-white px-3 py-2.5 text-[13px] text-ink focus:border-ink focus:outline-none"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="min-w-0 rounded-[8px] border border-line bg-white px-3 py-2.5 text-[13px] text-ink focus:border-ink focus:outline-none"
          >
            <option value="all">All stages</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-w-0 rounded-[8px] border border-line bg-white px-3 py-2.5 text-[13px] text-ink focus:border-ink focus:outline-none"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-ink-faint">
        {results.length} of {records.length} project{records.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-8 rounded-[14px] border border-line bg-white px-6 py-10 text-center">
          <p className="text-[14px] font-medium text-ink">No projects match your filters.</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 rounded-[8px] border border-line px-4 py-2 text-[13px] font-medium text-ink hover:border-ink"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {results.map((r) => (
            <li key={r.id}>
              <a
                href={recordDetailUrl(r.id)}
                className="block rounded-[12px] border border-line bg-white px-5 py-4 transition-colors hover:border-ink/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[14px] font-medium leading-snug text-ink">{r.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TONE_STYLES[statusTone(r.status)]}`}
                  >
                    {formatStatus(r.status)}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  {r.department} &middot; {r.location}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className="font-ledger font-tabular text-[15px] font-medium text-ink">
                    {formatNaira(recordCost(r))}
                    {r.awarded_cost ? "" : " est."}
                  </span>
                  <span className="text-[12px] text-ink-faint">
                    {formatDateRange(r.planned_start_date, r.planned_end_date)}
                  </span>
                </div>
                {r.vendor_name && (
                  <p className="mt-1.5 text-[12px] text-ink-faint">Awarded to {r.vendor_name}</p>
                )}
                <p className="mt-2.5 text-[12px] font-medium text-seal">
                  View full history &rarr;
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
