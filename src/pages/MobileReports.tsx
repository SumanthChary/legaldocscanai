import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, PieChart, Sparkles, Activity, TrendingUp } from "lucide-react";
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

  const aggregateStats = () => {
    if (!analyses.length) {
      return {
        scans: 0,
        highRisks: 0,
        savings: "$0",
        avgScore: 0,
      };
    }

    const scans = analyses.length;
    const highRisks = analyses.filter((analysis, index) => {
      const riskLevel = (analysis as any)?.risk_level || getRiskLevel(index);
      return riskLevel === "High";
    }).length;
    const savings = `$${(scans * 19).toLocaleString()}`;
    const avgScore = Math.min(100, Math.round((highRisks / scans) * 100));
    return { scans, highRisks, savings, avgScore };
  };

  const { scans, highRisks, savings, avgScore } = aggregateStats();

  const trendPoints = [18, 26, 19, 32, 24, 36, 30];
  const maxTrend = Math.max(...trendPoints, 1);
  const sparklinePath = trendPoints
    .map((value, index) => {
      const x = (index / (trendPoints.length - 1)) * 100;
      const y = 40 - (value / maxTrend) * 28;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const severityMix = [
    { label: "High", value: 28, color: "bg-red-500" },
    { label: "Medium", value: 52, color: "bg-amber-400" },
    { label: "Low", value: 20, color: "bg-emerald-500" },
  ];

  const contractMix = [
    { label: "NDA", value: 40, color: "#10B981" },
    { label: "MSA", value: 30, color: "#F97316" },
    { label: "SOW", value: 20, color: "#6366F1" },
    { label: "Other", value: 10, color: "#94A3B8" },
  ];

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-[#F4F7F5] px-4 pb-32 pt-6 text-slate-900 lg:max-w-3xl">
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Reports</p>
              <h1 className="font-display text-3xl leading-tight text-slate-900">Contract pages</h1>
              <p className="mt-2 text-sm text-slate-500">Browse your recent analyses with quick risk previews.</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{analyses.length} files</span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-3xl bg-slate-50/70 p-4 md:grid-cols-4">
            {[
              { label: "This week", value: scans },
              { label: "High risks", value: highRisks },
              { label: "Saved", value: savings },
              { label: "Risk score", value: `${avgScore}%` },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white bg-white/70 p-3 text-center shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
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
        <section className="mt-6 space-y-4 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
                <BarChart3 className="h-4 w-4 text-emerald-500" /> Analytics pulse
              </div>
              <p className="mt-2 text-sm text-slate-600">Summaries and insights based on your latest scans.</p>
            </div>
            <Button className="rounded-2xl bg-slate-900 text-white" onClick={() => navigate("/scan")}>
              Upload a new report
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-5 text-white md:col-span-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                <span>6 month trend</span>
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <TrendingUp className="h-3 w-3" /> +12% vs last month
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold">{scans} contracts scanned</p>
              <p className="text-sm text-white/70">{highRisks} risks escalated · {savings} saved</p>
              <svg viewBox="0 0 100 40" className="mt-4 h-24 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${sparklinePath} L100,40 L0,40 Z`} fill="url(#spark)" opacity={0.4} />
                <path d={sparklinePath} fill="none" stroke="#6EE7B7" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <PieChart className="h-4 w-4 text-emerald-500" /> Contracts by type
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className="relative h-24 w-24 rounded-full"
                  style={{
                    background: `conic-gradient(${contractMix
                      .map((segment, index, arr) => {
                        const start = arr.slice(0, index).reduce((sum, item) => sum + item.value, 0);
                        const end = start + segment.value;
                        return `${segment.color} ${start}% ${end}%`;
                      })
                      .join(", ")})`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full bg-white" />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-900">{scans || 0}</div>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  {contractMix.map((segment) => (
                    <div key={segment.label} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="font-semibold text-slate-900">{segment.label}</span>
                      <span className="text-slate-500">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>High-risk ratio</span>
                <span>{scans ? `${highRisks}/${scans}` : "0"}</span>
              </div>
              <div className="mt-4 h-3 w-full rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${scans ? Math.min(100, (highRisks / scans) * 100) : 0}%` }} />
              </div>
              <p className="mt-3 text-xs text-slate-500">Blockers flagged per upload. Keep the ratio under 25% through negotiation.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Activity className="h-4 w-4 text-emerald-500" /> Risk severity mix
              </div>
              <div className="mt-4 space-y-3">
                {severityMix.map((bucket) => (
                  <div key={bucket.label}>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{bucket.label}</span>
                      <span>{bucket.value}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full", bucket.color)} style={{ width: `${bucket.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Tip
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Tap any card above to open the clause-by-clause analysis. Export PDFs or continue a chat session instantly.
            </p>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
