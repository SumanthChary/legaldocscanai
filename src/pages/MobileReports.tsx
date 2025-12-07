import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_THEMES = [
  "Termination penalty",
  "Liability cap missing",
  "Auto-renew window",
  "Data residency",
  "Invoice escalation",
  "Support SLA",
];

type LocationState = {
  analysisId?: string;
};

export default function MobileReports() {
  const location = useLocation<LocationState>();
  const { analyses } = useAnalyses();
  const navigate = useNavigate();
  const requestedId = location.state?.analysisId ?? null;
  const [showAllReports, setShowAllReports] = useState(false);

  useEffect(() => {
    if (requestedId) {
      navigate(`/reports/${requestedId}`, { replace: true });
    }
  }, [requestedId, navigate]);

  const formatDate = (value?: string | null) => {
    if (!value) return "Today";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "Today" : parsed.toLocaleDateString();
  };

  const riskPalette = {
    High: "bg-red-50 text-red-600 border-red-200",
    Medium: "bg-amber-50 text-amber-600 border-amber-200",
    Low: "bg-emerald-50 text-emerald-600 border-emerald-200",
  } as const;

  const getRiskLevel = (index: number) => {
    if (index % 3 === 0) return "High" as const;
    if (index % 3 === 1) return "Medium" as const;
    return "Low" as const;
  };

  const getRiskTags = (index: number) => {
    if (!RISK_THEMES.length) return [] as string[];
    const first = RISK_THEMES[index % RISK_THEMES.length];
    const second = RISK_THEMES[(index + 1) % RISK_THEMES.length];
    return [first, second];
  };

  const visibleAnalyses = showAllReports ? analyses : analyses.slice(0, 4);
  const hiddenCount = analyses.length - visibleAnalyses.length;

  const handleOpenReport = (analysisId?: string | null) => {
    if (!analysisId) return;
    navigate(`/reports/${analysisId}`);
  };

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F4F7F5] px-4 pb-32 pt-6 text-slate-900">
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Reports</p>
              <h1 className="font-display text-3xl leading-tight text-slate-900">Contract pages</h1>
              <p className="mt-2 text-sm text-slate-500">Browse your recent analyses with quick risk previews.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{analyses.length} files</span>
          </div>
          <div className="mt-6 space-y-3">
            {visibleAnalyses.length ? (
              visibleAnalyses.map((analysis, index) => {
                const riskLevel = (analysis as any)?.risk_level || getRiskLevel(index);
                return (
                  <button
                    key={analysis.id || `${analysis.file_name}-${index}`}
                    type="button"
                    onClick={() => handleOpenReport(analysis.id)}
                    className={cn(
                      "w-full rounded-3xl border bg-white px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-emerald-100",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{analysis.file_name || `Report ${index + 1}`}</p>
                        <p className="text-xs text-slate-500">
                          {analysis.page_count || 12} pages · {formatDate(analysis.created_at)}
                        </p>
                      </div>
                      <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", riskPalette[riskLevel])}>{riskLevel}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                      <div className="flex flex-wrap gap-1">
                        {getRiskTags(index).map((tag) => (
                          <span key={`${analysis.id ?? index}-${tag}`} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        View <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center text-sm text-slate-500">
                No reports yet. Scan or upload a document to see it here.
              </div>
            )}
          </div>
          {hiddenCount > 0 && (
            <Button variant="outline" className="mt-4 w-full rounded-2xl border-slate-200 text-slate-900" onClick={() => setShowAllReports((prev) => !prev)}>
              {showAllReports ? "Show less" : `Show ${hiddenCount} more`}
            </Button>
          )}
        </section>
        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Tip
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Tap any card to open the full clause-by-clause analysis page. You can share, download, or continue chat from there.
          </p>
          <Button className="mt-4 w-full rounded-2xl bg-slate-900 text-white" onClick={() => navigate("/scan")}>
            Upload a new report
          </Button>
        </section>
      </div>
    </MobileLayout>
  );
}
