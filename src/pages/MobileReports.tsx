import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowUpRight, Download, FileText, Share2, ShieldCheck, Sparkles } from "lucide-react";

const SUMMARY_POINTS = [
  {
    title: "Termination penalty is absolute",
    detail: "Vendor charges 4 months of fees if we exit early with no cure period or notice flexibility.",
  },
  {
    title: "Liability is uncapped",
    detail: "Clause 9.2 exposes us to unlimited consequential damages despite mutual indemnity language.",
  },
  {
    title: "Auto-renew triggers in 30 days",
    detail: "Cancellation window is short; reminder task should fire at least 14 days prior to term end.",
  },
];

const SAMPLE_RISKS = [
  {
    level: "High",
    title: "Termination penalty",
    clause: "Sec. 12.4",
    detail: "Requires 120-day fees upon notice regardless of cause.",
    action: "Negotiate a sliding scale cap and a breach carve-out.",
  },
  {
    level: "High",
    title: "Broad indemnification",
    clause: "Sec. 9.2",
    detail: "Covers indirect damages and third-party IP claims without limitation.",
    action: "Carve out indirect damages and align with service value.",
  },
  {
    level: "Medium",
    title: "Auto-renewal",
    clause: "Sec. 3.1",
    detail: "Automatic 12-month renewal with 30-day notice requirement.",
    action: "Add opt-in renewal and 60-day notification.",
  },
  {
    level: "Low",
    title: "Audit rights",
    clause: "Sec. 7.3",
    detail: "Reasonable access but request electronic-first review.",
    action: "No change required; document process in playbook.",
  },
];

const PROMPT_SUGGESTIONS = [
  "Summarize 3 blockers",
  "Draft redlines",
  "Explain renewal obligations",
  "Prep exec brief",
];

type LocationState = {
  analysisId?: string;
};

export default function MobileReports() {
  const location = useLocation<LocationState>();
  const { analyses } = useAnalyses();

  const current = useMemo(() => {
    const requestedId = location.state?.analysisId;
    if (!analyses.length) return undefined;
    if (requestedId) {
      return analyses.find((analysis) => analysis.id === requestedId) || analyses[0];
    }
    return analyses[0];
  }, [analyses, location.state]);

  const stats = [
    { label: "Pages", value: current?.page_count ? `${current.page_count}` : "27" },
    { label: "Counterparty", value: current?.counterparty || "Stitch Labs" },
    { label: "Scanned", value: current ? new Date(current.created_at).toLocaleDateString() : "Today" },
    { label: "Status", value: (current?.status || current?.analysis_status || "Draft").toString() },
  ];

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F4F7F5] px-4 pb-32 pt-6 text-slate-900">
        <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Contract report</p>
              <h1 className="font-display text-3xl leading-tight text-slate-900">{current?.file_name || "Vendor Agreement"}</h1>
              <p className="mt-2 text-sm text-slate-500">Prepared by LegalDeep AI · {stats[0].value} pages</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.4em] text-red-500">Risk score</p>
              <p className="text-sm font-semibold text-red-600">82 · High</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-red-100 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-red-500">Alert</p>
                <p className="text-sm font-semibold text-red-600">3 blocking clauses need counsel review</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="mt-3 text-sm text-red-700">Termination, liability, and renewal language are outside playbook tolerances.</p>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
            <Sparkles className="h-4 w-4 text-emerald-500" /> Instant summary
          </div>
          <div className="mt-4 space-y-3">
            {SUMMARY_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">{point.title}</p>
                <p className="mt-1 text-sm text-slate-500">{point.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Clause risks</p>
              <p className="font-display text-2xl text-slate-900">Review queue</p>
            </div>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
              Export list <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {SAMPLE_RISKS.map((risk) => (
              <div key={risk.title} className="rounded-3xl border border-slate-100 bg-white/70 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{risk.title}</p>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{risk.clause}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      risk.level === "High"
                        ? "bg-red-50 text-red-600"
                        : risk.level === "Medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {risk.level}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{risk.detail}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Next step · {risk.action}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-3">
          <div className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Compliance checkpoints
            </div>
            <div className="mt-4 space-y-3">
              {["SOC 2 coverage missing", "Data residency optional", "Support SLA undefined"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-900 bg-slate-900 p-6 text-white">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/60">Ask LegalDeep</p>
            <p className="mt-2 text-lg font-semibold">“What is the liability cap if we breach?”</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {PROMPT_SUGGESTIONS.map((prompt) => (
                <button key={prompt} className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-left text-xs font-semibold text-white">
                  {prompt}
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full rounded-2xl bg-white text-slate-900">
              Open contract Q&A
            </Button>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3 rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Deliver report</p>
            <p className="text-xs text-slate-500">PDF + raw clauses</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-2xl border-slate-200 text-slate-900">
              <Share2 className="h-4 w-4" /> Share summary
            </Button>
            <Button className="flex-1 rounded-2xl bg-slate-900 text-white">
              <Download className="h-4 w-4" /> Pay & download ($19)
            </Button>
          </div>
        </section>
      </div>
    </MobileLayout>
  );
}
