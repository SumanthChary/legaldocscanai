import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, Bell, Settings2, ArrowUpRight, Shield, FileText, Share2 } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { cn } from "@/lib/utils";

const InsightCard = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="flex flex-1 flex-col rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm">
    <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">{label}</p>
    <p className={cn("mt-2 text-2xl font-semibold text-slate-900", accent)}>{value}</p>
  </div>
);

export default function MobileHome() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();

  const summary = useMemo(() => {
    const completed = analyses.filter((analysis) => (analysis.status || analysis.analysis_status) === "completed");
    return {
      total: analyses.length,
      completed: completed.length,
      risks: Math.max(completed.length - 1, 0),
    };
  }, [analyses]);

  const formatTimestamp = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - created.getTime()) / 36e5);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return created.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const recent = (isRefreshing ? Array.from({ length: 3 }) : analyses.slice(0, 3)).map((analysis, index) => {
    const fallbackTitles = ["NDA with Acme Corp.", "Service Agreement", "Employment Contract"];
    const fallbackAges = ["2 hours ago", "Yesterday", "2 days ago"];
    const title = analysis?.file_name || fallbackTitles[index] || `Contract ${index + 1}`;
    const subtitle = analysis ? `${analysis.page_count || 12} pages · ${formatTimestamp(analysis.created_at)}` : fallbackAges[index];
    const status = analysis?.status || analysis?.analysis_status || (index === 1 ? "Needs review" : "Status");
    const isHigh = index === 0;
    return (
      <button
        key={analysis?.id || index}
        onClick={() => navigate("/reports", { state: { analysisId: analysis?.id } })}
        className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-semibold",
            isHigh ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500",
          )}
        >
          {status}
        </div>
      </button>
    );
  });

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F4F7F5] px-4 pb-32 pt-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-500">LegalDeep</p>
            <h1 className="font-display text-3xl text-slate-900">Home</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <Bell size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
              <Settings2 size={18} />
            </button>
          </div>
        </header>

        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Camera className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Scanner ready</p>
              <h2 className="font-display text-2xl text-slate-900">Scan with Camera</h2>
              <p className="text-xs text-slate-500">Upload PDF/DOCX in seconds</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <button
              onClick={() => navigate("/scan")}
              className="h-12 rounded-2xl bg-emerald-500 text-sm font-semibold text-white shadow-lg"
            >
              Start scan · camera
            </button>
            <button
              onClick={() => navigate("/document-analysis")}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-900"
            >
              <Upload size={16} /> Upload PDF / DOCX
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Recent scans</p>
              <p className="font-display text-2xl text-slate-900">Case log</p>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"
            >
              View all <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {isRefreshing ? (
              <div className="space-y-3">
                {[1, 2, 3].map((skeleton) => (
                  <div key={skeleton} className="h-16 animate-pulse rounded-3xl border border-slate-100 bg-slate-50" />
                ))}
              </div>
            ) : (
              recent
            )}
          </div>
        </section>

        <section className="mt-6 flex gap-3">
          <InsightCard label="Scans" value={`${summary.total}`} />
          <InsightCard label="High risk" value={`${summary.risks}`} accent="text-emerald-600" />
          <InsightCard label="Reports" value={`${summary.completed}`} />
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
            <Shield size={14} /> Key playbooks
          </div>
          <div className="mt-4 grid gap-3">
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Generate risk report</p>
                <p className="text-xs text-slate-500">PDF export + insights</p>
              </div>
              <ArrowUpRight size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => navigator.share?.({ title: "LegalDeep AI", url: window.location.origin }).catch(() => undefined)}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Share latest summary</p>
                <p className="text-xs text-slate-500">Send to counsel or clients</p>
              </div>
              <Share2 size={16} className="text-slate-400" />
            </button>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
