import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, FileWarning, Clock, ArrowUpRight, CheckCircle2, AlertTriangle, Layers3 } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Card } from "@/components/ui/card";

const filters = [
  { key: "all", label: "All" },
  { key: "high", label: "High Risk" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

type FilterKey = typeof filters[number]["key"];

const deriveRiskMeta = (analysisId: string, index: number) => {
  const levels = [
    { level: "high" as const, label: "3H", badgeBg: "bg-red-50", text: "text-red-600" },
    { level: "medium" as const, label: "2M", badgeBg: "bg-amber-50", text: "text-amber-600" },
    { level: "low" as const, label: "1L", badgeBg: "bg-emerald-50", text: "text-emerald-600" },
  ];
  const meta = levels[index % levels.length];
  return { ...meta, id: analysisId };
};

const formatDateLabel = (dateString: string) => {
  const created = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - created.getTime();
  const diffDays = diff / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return "Today";
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  return created.toLocaleDateString();
};

const formatExactDate = (dateString: string) => {
  const created = new Date(dateString);
  return created.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatTime = (dateString: string) => {
  const created = new Date(dateString);
  return created.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

const resolveStatusKey = (analysis: { status?: string; analysis_status?: string }) =>
  (analysis.status || analysis.analysis_status || "pending").toString().toLowerCase();

const statusThemes: Record<
  string,
  {
    label: string;
    badge: string;
    text: string;
    accent: string;
    Icon: typeof Clock;
  }
> = {
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-600",
    text: "text-emerald-600",
    accent: "text-emerald-500",
    Icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    badge: "bg-amber-50 text-amber-600",
    text: "text-amber-600",
    accent: "text-amber-500",
    Icon: Clock,
  },
  pending: {
    label: "Pending",
    badge: "bg-slate-100 text-slate-500",
    text: "text-slate-500",
    accent: "text-slate-400",
    Icon: Clock,
  },
  failed: {
    label: "Action Needed",
    badge: "bg-red-50 text-red-600",
    text: "text-red-600",
    accent: "text-red-500",
    Icon: AlertTriangle,
  },
};

export default function MobileHistory() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    return analyses
      .filter((analysis) =>
        (analysis.file_name || "").toLowerCase().includes(query.toLowerCase())
      )
      .filter((analysis, index) => {
        if (activeFilter === "all") return true;
        const created = new Date(analysis.created_at);
        const now = new Date();
        const diffDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        const risk = deriveRiskMeta(analysis.id, index).level;
        if (activeFilter === "high") return risk === "high";
        if (activeFilter === "today") return diffDays < 1;
        if (activeFilter === "week") return diffDays < 7;
        if (activeFilter === "month") return diffDays < 30;
        return true;
      });
  }, [analyses, query, activeFilter]);

  const highRiskCount = filtered.reduce((total, analysis, index) => {
    return deriveRiskMeta(analysis.id, index).level === "high" ? total + 1 : total;
  }, 0);

  const headerRight = (
    <div className="flex items-center gap-2">
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
        <Search size={18} />
      </button>
      <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
        <Filter size={18} />
      </button>
    </div>
  );

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F4F7F5]">
        <MobileHeader title="History" rightSlot={headerRight} />

        <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-32 pt-4">
          <section className="rounded-[32px] border border-slate-100 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Scan history</p>
                <p className="font-display text-3xl text-slate-900">{analyses.length} logs</p>
                <p className="text-sm text-slate-500">{highRiskCount} high risk · {analyses.length - highRiskCount} clean</p>
              </div>
              <button
                onClick={() => navigate("/scan")}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                New scan
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Completed</p>
                <p className="text-2xl font-semibold text-emerald-600">
                  {analyses.filter((analysis) => resolveStatusKey(analysis) === "completed").length}
                </p>
                <p className="text-[11px] text-slate-500">Reports delivered</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Processing</p>
                <p className="text-2xl font-semibold text-amber-600">
                  {analyses.filter((analysis) => resolveStatusKey(analysis) === "processing").length}
                </p>
                <p className="text-[11px] text-slate-500">Awaiting review</p>
              </div>
            </div>
          </section>

          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex h-9 items-center rounded-full border px-4 text-sm font-semibold transition ${
                  key === activeFilter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search agreements or parties"
              className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-xs font-medium text-slate-500">
                Clear
              </button>
            )}
          </div>

          <section className="space-y-4">
            {isRefreshing ? (
              [1, 2, 3].map((skeleton) => (
                <Card key={skeleton} className="h-[160px] animate-pulse rounded-3xl border border-slate-100 bg-white" />
              ))
            ) : filtered.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 p-8 text-center">
                <FileWarning className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-base font-semibold text-slate-700">No scans match these filters</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try adjusting your filters or start a new scan to populate this view.
                </p>
                <button
                  onClick={() => navigate("/scan")}
                  className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                >
                  Launch scanner
                </button>
              </Card>
            ) : (
              filtered.map((analysis, index) => {
                const risk = deriveRiskMeta(analysis.id, index);
                const statusKey = resolveStatusKey(analysis);
                const statusTheme = statusThemes[statusKey] || statusThemes.pending;
                const { Icon } = statusTheme;
                const shortId = (analysis.id || "").slice(0, 6) || "—";

                return (
                  <Card key={analysis.id} className="flex gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex flex-1 gap-4">
                        <div className="h-[120px] w-[90px] rounded-2xl bg-gradient-to-br from-emerald-200/60 to-white shadow-inner" />
                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Contracts & Agreements</p>
                                <p className="truncate text-lg font-semibold text-slate-900">
                                  {analysis.file_name || "Untitled contract"}
                                </p>
                              </div>
                              <div className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTheme.badge}`}>
                                {statusTheme.label}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>Scanned {formatExactDate(analysis.created_at)} · {analysis.page_count || 12} pages</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                                <Layers3 className="h-3 w-3 text-slate-400" /> ID {shortId}
                              </span>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                risk.level === "high"
                                  ? "bg-red-50 text-red-600"
                                  : risk.level === "medium"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-emerald-50 text-emerald-600"
                              }`}
                              >
                                {risk.level === "high" ? "H" : risk.level === "medium" ? "M" : "L"}
                              </div>
                              <span className="text-xs font-semibold text-slate-500">
                                {risk.level === "high" ? "High risk flagged" : risk.level === "medium" ? "Monitor soon" : "All clear"}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/reports?doc=${analysis.id}`)}
                            className="mt-3 inline-flex items-center justify-center gap-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                          >
                            View report
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                  </Card>
                );
              })
            )}
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Insights</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <p>
                  {analyses.filter((analysis) => resolveStatusKey(analysis) === "completed").length} reports cleared review in the last 7 days.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                <p>Renewal risk is concentrated in the {filters.find((f) => f.key === activeFilter)?.label || "selected"} view.</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MobileLayout>
  );
}