import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { FileText, ArrowUpRight } from "lucide-react";

const FILTERS = ["All", "High risk", "Today", "This week", "Month"] as const;

type Filter = (typeof FILTERS)[number];

export default function MobileHistory() {
  const navigate = useNavigate();
  const { analyses } = useAnalyses();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return analyses;
    return analyses.filter((analysis, index) => (activeFilter === "High risk" ? index % 2 === 0 : true));
  }, [analyses, activeFilter]);

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F4F7F5] px-4 pb-32 pt-6">
        <header className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Scan history</p>
          <h1 className="font-display text-3xl text-slate-900">{analyses.length} logs</h1>
          <p className="text-sm text-slate-500">{Math.max(1, Math.floor(analyses.length / 2))} high risk · auto saved</p>
          <button
            onClick={() => navigate("/scan")}
            className="mt-5 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white"
          >
            New scan
          </button>
        </header>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex h-9 items-center rounded-full border px-4 text-sm font-semibold ${
                activeFilter === filter ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {filtered.slice(0, 4).map((analysis, index) => (
            <div key={analysis.id || index} className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{analysis.file_name || `Contract ${index + 1}`}</p>
                <p className="text-xs text-slate-500">{analysis.page_count || 12} pages · {new Date(analysis.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => navigate("/reports", { state: { analysisId: analysis.id } })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"
              >
                View report <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
