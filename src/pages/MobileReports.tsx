import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, Sparkles, TrendingUp } from "lucide-react";
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
  const location = useLocation();
  const { analyses } = useAnalyses();
  const navigate = useNavigate();
  const requestedId = (location.state as LocationState | undefined)?.analysisId ?? null;
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

  type RiskLevel = keyof typeof riskPalette;

  const getRiskLevel = (index: number) => {
    if (index % 3 === 0) return "High" as const;
    if (index % 3 === 1) return "Medium" as const;
    return "Low" as const;
  };

  const normalizeRiskLevel = (value: unknown): RiskLevel | null => {
    if (typeof value !== "string") return null;
    const normalized = value.toLowerCase();
    if (normalized.includes("high")) return "High";
    if (normalized.includes("medium")) return "Medium";
    if (normalized.includes("low")) return "Low";
    return null;
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

  const dateCounts = analyses.reduce<Record<string, number>>((counts, analysis) => {
    const date = analysis?.created_at ? new Date(analysis.created_at) : new Date();
    if (Number.isNaN(date.getTime())) return counts;
    date.setHours(0, 0, 0, 0);
    const key = date.toISOString().split("T")[0];
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  const buildBuckets = (days: number, offset = 0) => {
    return Array.from({ length: days }, (_, position) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - 1 - position + offset));
      const key = date.toISOString().split("T")[0];
      return {
        key,
        count: dateCounts[key] || 0,
      };
    });
  };

  const currentWeekBuckets = buildBuckets(7);
  const previousWeekBuckets = buildBuckets(7, 7);
  const trendPoints = currentWeekBuckets.map((bucket) => bucket.count);
  const currentWeekTotal = trendPoints.reduce((sum, value) => sum + value, 0);
  const previousWeekTotal = previousWeekBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const changePercent = previousWeekTotal === 0 ? (currentWeekTotal ? 100 : 0) : Math.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100);
  const changeLabel = `${changePercent >= 0 ? "+" : ""}${changePercent}% vs last week`;
  const maxTrend = Math.max(...trendPoints, 1);
  const sparklinePath = trendPoints
    .map((value, index) => {
      const x = (index / (trendPoints.length - 1)) * 100;
      const y = 40 - (value / maxTrend) * 28;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const riskCounts = analyses.reduce(
    (counts, analysis, index) => {
      const resolved = normalizeRiskLevel((analysis as any)?.risk_level) ?? getRiskLevel(index);
      counts[resolved] += 1;
      return counts;
    },
    { High: 0, Medium: 0, Low: 0 } as Record<RiskLevel, number>,
  );

  const severityData = (Object.keys(riskCounts) as RiskLevel[]).map((level) => ({
    label: level,
    value: scans ? Math.round((riskCounts[level] / scans) * 100) : 0,
    bar:
      level === "High" ? "bg-red-500" : level === "Medium" ? "bg-amber-400" : "bg-emerald-500",
  }));

  const clauseFrequency = analyses.reduce<Record<string, number>>((acc, _analysis, index) => {
    getRiskTags(index).forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const derivedClauses = Object.entries(clauseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const topClauses = derivedClauses.length ? derivedClauses : RISK_THEMES.slice(0, 3).map((theme) => [theme, 0] as const);

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
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-5 text-white">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                <span>Analytics pulse</span>
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <TrendingUp className="h-3 w-3" /> {changeLabel}
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold">{scans} scans</p>
              <p className="text-sm text-white/70">{currentWeekTotal} this week · {highRisks} blockers flagged</p>
              <svg viewBox="0 0 100 40" className="mt-5 h-20 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spark-mini" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${sparklinePath} L100,40 L0,40 Z`} fill="url(#spark-mini)" opacity={0.6} />
                <path d={sparklinePath} fill="none" stroke="#6EE7B7" strokeWidth={2.2} strokeLinecap="round" />
              </svg>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Avg risk score</p>
                  <p className="text-lg font-semibold">{avgScore}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Time saved</p>
                  <p className="text-lg font-semibold">{analyses.length ? `${analyses.length * 2} hrs` : "--"}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <BarChart3 className="h-4 w-4 text-emerald-500" /> Risk mix
              </div>
              <div className="mt-4 space-y-3">
                {severityData.map((bucket) => (
                  <div key={bucket.label}>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>{bucket.label}</span>
                      <span>{bucket.value}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full", bucket.bar)} style={{ width: `${bucket.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                {topClauses.map(([theme, count]) => (
                  <span key={theme} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                    {theme} · {count}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-500">
                Keep renegotiation-ready clauses under 25% by sharing reports weekly.
              </div>
            </div>
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
          <div className="mt-4 rounded-3xl border border-slate-100 bg-white/80 p-5 text-sm text-slate-600">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Sparkles className="h-4 w-4 text-emerald-500" /> Tip
            </div>
            <p className="mt-2">
              Tap a report card to open the full clause-by-clause view, export PDFs, or keep chatting with counsel.
            </p>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
