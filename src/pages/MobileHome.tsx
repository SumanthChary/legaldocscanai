import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Share2, Shield, Zap, Clock4, ArrowUpRight } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { DocumentScanner } from "@/components/document-analysis/upload/DocumentScanner";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { cn } from "@/lib/utils";

export default function MobileHome() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [user, setUser] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const completedAnalyses = useMemo(
    () => analyses.filter((analysis) => (analysis.status || analysis.analysis_status) === "completed"),
    [analyses],
  );

  const insights = useMemo(() => ({
    highRisk: Math.max(completedAnalyses.length - 1, 0),
    expiring: Math.min(analyses.length, 5),
    totalSavings: (completedAnalyses.length * 2400).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }),
  }), [analyses.length, completedAnalyses.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 36e5);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleScanComplete = () => {
    setShowScanner(false);
    navigate("/history");
  };

  const renderRecent = () => {
    if (isRefreshing) {
      return [1, 2, 3].map((skeleton) => (
        <div key={skeleton} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 animate-pulse">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ));
    }

    if (analyses.length === 0) {
      return <p className="py-6 text-center text-sm text-slate-500">No documents analyzed yet.</p>;
    }

    return analyses.slice(0, 3).map((analysis, index) => {
      const status = (analysis.status || analysis.analysis_status || "status").toString();
      const isRisk = status.toLowerCase().includes("risk") || status.toLowerCase().includes("fail");
      return (
        <div key={analysis.id || index} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-900">{analysis.file_name || `Document ${index + 1}`}</p>
              <p className="text-xs text-slate-500">{formatDate(analysis.created_at)} · {(analysis.page_count || 12)} pages</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold",
                isRisk ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700",
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {status}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", isRisk ? "bg-amber-500" : "bg-emerald-500")} />
              {isRisk ? "Risk briefing" : "Clean review"}
            </div>
            <button
              onClick={() => navigate("/reports")}
              className="inline-flex items-center gap-1 font-semibold text-slate-700"
            >
              Open <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      );
    });
  };

  const statCards = [
    { label: "Scans", value: analyses.length, hint: "This month" },
    { label: "High risk", value: insights.highRisk, hint: "Flagged" },
    { label: "Expiring", value: insights.expiring, hint: "Renewals" },
  ];

  const headerRight = (
    <img
      src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/8.x/initials/svg?seed=LD"}
      alt="profile"
      className="h-11 w-11 rounded-full border border-slate-200 object-cover"
    />
  );

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F8FAFC]">
        <MobileHeader showBack={false} title="Home" rightSlot={headerRight} />

        <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-32 pt-5">
          <section className="relative overflow-hidden rounded-[32px] border border-slate-100 bg-white/90 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 to-transparent" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-slate-400">Live briefing</p>
            <h1 className="font-display text-4xl leading-tight text-slate-900">Contracts anywhere. Zero guesswork.</h1>
            <p className="mt-3 text-sm text-slate-500">
              Capture scans, flag risky clauses, and brief your team directly from your phone.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowScanner(true)}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                <Shield className="mr-2 h-4 w-4" /> Scan contract
              </button>
              <button
                onClick={() => navigate("/scan")}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-900/20 px-4 py-3 text-sm font-semibold text-slate-900"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload file
              </button>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Autopilot detection online
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-100 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Today</p>
                <p className="font-display text-2xl text-slate-900">Casewatch</p>
              </div>
              <button
                onClick={() => navigate("/history")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600"
              >
                View log <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {renderRecent()}
            </div>
          </section>

          <section className="grid grid-cols-3 gap-3">
            {statCards.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500">{stat.hint}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[28px] border border-slate-100 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Zap size={16} /> Rapid playbooks
            </div>
            <div className="mt-4 grid gap-3">
              <button
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
                onClick={() => navigate("/reports")}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">Create redline packet</p>
                  <p className="text-xs text-slate-500">AI clauses + share-ready PDF</p>
                </div>
                <ArrowUpRight size={18} className="text-slate-500" />
              </button>
              <button
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left"
                onClick={() => navigate("/document-summary")}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">Summarize negotiations</p>
                  <p className="text-xs text-slate-500">Extract asks + blockers</p>
                </div>
                <ArrowUpRight size={18} className="text-slate-500" />
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-100 bg-white/95 p-5 shadow-[inset_0_1px_0_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
              <Clock4 size={14} /> Response queue
            </div>
            <p className="mt-3 font-display text-2xl text-slate-900">{completedAnalyses.length} dossiers ready</p>
            <p className="text-sm text-slate-500">Send a quick share link or schedule a follow-up call.</p>
            <button
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "LegalDeep AI",
                      text: "Instant contract insights anywhere",
                      url: window.location.origin,
                    })
                    .catch(() => undefined);
                }
              }}
            >
              <Share2 size={16} /> Share latest brief
            </button>
          </section>
        </main>

        {showScanner && <DocumentScanner onScan={handleScanComplete} onClose={() => setShowScanner(false)} />}
      </div>
    </MobileLayout>
  );
}