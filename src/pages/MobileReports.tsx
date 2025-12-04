import { useMemo } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Download, Share2, ShieldAlert, Sparkles, FileText, ScrollText, Copy, MessageCircle } from "lucide-react";

interface RiskItem {
  level: "High" | "Medium" | "Low";
  title: string;
  description?: string;
  excerpt?: string;
}

const fallbackRiskHighlights: RiskItem[] = [
  {
    level: "High",
    title: "Ambiguous termination clause",
    description: "Clause does not clearly define conditions to exit the contract, risking disputes.",
    excerpt: "'This agreement may be terminated by either party with written notice.'",
  },
  {
    level: "Medium",
    title: "Auto-renewal without notice",
    description: "Agreement renews automatically unless cancelled but lacks a notice requirement.",
    excerpt: "'Term renews every 12 months unless a party cancels.'",
  },
  {
    level: "High",
    title: "Uncapped liability",
    description: "Vendor's liability is not limited, exposing you to unlimited damages.",
  },
];

const levelBadge: Record<RiskItem["level"], string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-emerald-100 text-emerald-600",
};

export default function MobileReports() {
  const { analyses } = useAnalyses();

  const primaryAnalysis = analyses[0];

  const parsedSummary = useMemo(() => {
    if (!primaryAnalysis?.summary) return {} as any;
    if (typeof primaryAnalysis.summary === "string") {
      try {
        return JSON.parse(primaryAnalysis.summary);
      } catch {
        return {} as any;
      }
    }
    return primaryAnalysis.summary as any;
  }, [primaryAnalysis]);

  const riskHighlights: RiskItem[] = Array.isArray(parsedSummary?.risks) && parsedSummary.risks.length
    ? parsedSummary.risks.map((risk: any) => ({
        level: (risk.level as RiskItem["level"]) || "Medium",
        title: risk.title || "Risk",
        description: risk.description,
        excerpt: risk.excerpt,
      }))
    : fallbackRiskHighlights;

  const headerRight = (
    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
      <Share2 size={18} />
    </button>
  );

  const scanDate = primaryAnalysis ? new Date(primaryAnalysis.created_at) : null;
  const accuracy = parsedSummary?.confidence || "89%";
  const clauses = parsedSummary?.clauses_reviewed || 42;
  const pages = primaryAnalysis?.page_count || 24;

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F6F8F7]">
        <MobileHeader title="Contract report" rightSlot={headerRight} />
        <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-32 pt-4">
          <section className="rounded-[32px] border border-slate-100 bg-white/95 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Vendor agreement</p>
                <h1 className="font-display text-3xl text-slate-900">{primaryAnalysis?.file_name || "Vendor Agreement"}</h1>
              </div>
              <div className={`rounded-full px-4 py-1 text-xs font-semibold ${levelBadge[riskHighlights[0]?.level || "High"]}`}>
                {riskHighlights[0]?.level || "High"} risk
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {scanDate ? `${scanDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · ${pages} pages` : "Recent capture"}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Clauses</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">{clauses}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Accuracy</p>
                <p className="mt-1 text-xl font-semibold text-emerald-600">{accuracy}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Status</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {(primaryAnalysis?.status || primaryAnalysis?.analysis_status || "Processing").toString()}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Risk highlights</p>
              <div className="rounded-full bg-slate-200/70 px-3 py-1 text-xs text-slate-600">AI briefing</div>
            </div>
            {riskHighlights.map((risk) => (
              <Card key={risk.title} className="space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold ${
                      risk.level === "High"
                        ? "bg-red-50 text-red-600"
                        : risk.level === "Medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {risk.level.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Clause alert</p>
                    <p className="text-base font-semibold text-slate-900">{risk.title}</p>
                  </div>
                </div>
                {risk.description && <p className="text-sm text-slate-600">{risk.description}</p>}
                {risk.excerpt && (
                  <blockquote className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs italic text-slate-500">
                    {risk.excerpt}
                  </blockquote>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 text-slate-900">
                    <Copy className="mr-2 h-4 w-4" /> Copy risk
                  </Button>
                  <Button className="flex-1 rounded-2xl bg-slate-900 text-white">
                    <MessageCircle className="mr-2 h-4 w-4" /> Contract Q&A
                  </Button>
                </div>
              </Card>
            ))}
          </section>

          <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <ScrollText size={14} /> Clause timeline
            </div>
            <div className="space-y-4">
              {riskHighlights.slice(0, 4).map((risk, index) => (
                <div key={`${risk.title}-${index}`} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{risk.title}</p>
                    <p className="text-xs text-slate-500">Flagged {index + 1}m ago · {risk.level} risk</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Sparkles size={14} /> AI assistant
            </div>
            <p className="mt-3 text-base font-semibold text-slate-900">Ask about this contract</p>
            <p className="text-sm text-slate-500">Query any clause, deadline, or obligation using natural language.</p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              "Summarize the indemnification obligations in plain English."
            </div>
            <Button className="mt-4 h-12 w-full rounded-2xl bg-slate-900 text-white">Open Contract Q&A</Button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
              <ShieldAlert size={14} /> Export safeguards
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-slate-500" />
                <p>Secure PDF bundle with highlights and clause transcripts.</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles size={18} className="text-slate-500" />
                <p>Optional AI-written executive summary for stakeholders.</p>
              </div>
            </div>
          </section>
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-sm border-t border-white/60 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 text-slate-900">
              <Share2 className="mr-2 h-4 w-4" /> Share report
            </Button>
            <Button className="flex-1 rounded-2xl bg-slate-900 text-white">
              <Download className="mr-2 h-4 w-4" /> Pay & Download ($19)
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
