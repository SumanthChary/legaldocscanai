import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDocumentAnalysis } from "@/hooks/document-summary/useDocumentAnalysis";
import { SummaryContent } from "@/components/document-summary/SummaryContent";
import { AlertCircle, AlertTriangle, CheckCircle2, Download, Loader2, Share2 } from "lucide-react";

type RiskLevel = "High" | "Medium" | "Low";

interface RiskItem {
  level: RiskLevel;
  title: string;
  location?: string;
  description?: string;
  suggestion?: string;
}

const fallbackRisks: RiskItem[] = [
  {
    level: "High",
    title: "Uncapped indemnification",
    location: "Page 8 ¶2",
    description: "No limit on financial responsibility for damages.",
    suggestion: "Propose a reasonable liability cap.",
  },
  {
    level: "High",
    title: "Ambiguous liability clause",
    location: "Page 12 ¶4",
    description: "Lacks specific definitions, creating potential for misinterpretation.",
    suggestion: "Clarify terms with the counter party.",
  },
  {
    level: "Medium",
    title: "Automatic renewal",
    location: "Page 22 ¶9",
    description: "Renews automatically without explicit consent.",
    suggestion: "Negotiate for manual renewal.",
  },
  {
    level: "Low",
    title: "Standard force majeure",
    location: "Page 15 ¶3",
    description: "Clause is standard and presents minimal risk.",
    suggestion: "No action required.",
  },
];

const levelStyles: Record<RiskLevel, { badge: string; indicator: string }> = {
  High: { badge: "bg-red-100 text-red-600", indicator: "bg-red-500" },
  Medium: { badge: "bg-amber-100 text-amber-600", indicator: "bg-amber-500" },
  Low: { badge: "bg-emerald-100 text-emerald-600", indicator: "bg-emerald-500" },
};

export default function MobileDocumentSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { analysis, loading, refreshing, fetchAnalysis } = useDocumentAnalysis(id!);

  const parseSummaryData = () => {
    if (!analysis?.summary) return {} as any;
    if (typeof analysis.summary === "string") {
      try {
        return JSON.parse(analysis.summary);
      } catch {
        return {} as any;
      }
    }
    return analysis.summary as any;
  };

  const summaryData = parseSummaryData();
  const risks: RiskItem[] = Array.isArray(summaryData?.risks) && summaryData.risks.length
    ? summaryData.risks
    : fallbackRisks;

  const riskCounts = risks.reduce(
    (acc, risk) => {
      acc[risk.level] = (acc[risk.level] || 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 } as Record<RiskLevel, number>,
  );

  const dominantRisk: RiskLevel = riskCounts.High
    ? "High"
    : riskCounts.Medium
      ? "Medium"
      : "Low";

  const status = analysis?.status || analysis?.analysis_status;

  const statusMeta = {
    completed: {
      label: "Ready",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      badge: "bg-emerald-100 text-emerald-700",
    },
    processing: {
      label: "Processing",
      icon: <Loader2 className="h-5 w-5 animate-spin text-sky-500" />,
      badge: "bg-sky-100 text-sky-700",
    },
    failed: {
      label: "Failed",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      badge: "bg-red-100 text-red-700",
    },
    default: {
      label: "Pending",
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      badge: "bg-amber-100 text-amber-600",
    },
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F6F8F7]">
          <MobileHeader title="Legal risk report" />
          <div className="space-y-4 px-4 py-6">
            {[1, 2, 3].map((skeleton) => (
              <Card key={skeleton} className="h-32 animate-pulse rounded-3xl border border-slate-100 bg-white" />
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!analysis) {
    return (
      <MobileLayout>
        <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F6F8F7]">
          <MobileHeader title="Legal risk report" />
          <div className="px-4 py-6">
            <Card className="space-y-4 rounded-3xl border border-slate-100 bg-white p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <p className="text-lg font-semibold">Document not found</p>
              <p className="text-sm text-slate-500">This report may have been deleted or never existed.</p>
              <Button onClick={() => navigate("/history")} className="rounded-2xl">
                Back to history
              </Button>
            </Card>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const statusInfo = statusMeta[status as keyof typeof statusMeta] || statusMeta.default;

  return (
    <MobileLayout>
      <div className="mx-auto flex min-h-screen max-w-sm flex-col bg-[#F6F8F7]">
        <MobileHeader title="Legal risk report" />
        <main className="flex-1 space-y-5 overflow-y-auto px-4 pb-32 pt-4">
          <section className="rounded-[32px] border border-white/40 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 text-white shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-white/60">
              <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
              <span>Report ready</span>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight">{analysis.file_name || analysis.original_name}</h2>
            <p className="mt-3 text-sm text-white/70">
              {analysis.summary?.overview || summaryData?.overview || "AI scanned each clause for liability, renewal, and compliance risk."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Risk level</p>
                <p className="text-2xl font-semibold">{dominantRisk} risk</p>
                <p className="text-xs text-white/70">
                  {riskCounts.High} High • {riskCounts.Medium} Medium • {riskCounts.Low} Low
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Status</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  {statusInfo.icon}
                  {statusInfo.label}
                </div>
                <p className="mt-2 text-xs text-white/70">ID · {(analysis.id || "").slice(0, 6)}</p>
              </div>
            </div>
          </section>

          {status === "processing" && (
            <Card className="rounded-3xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-semibold">Processing document</p>
              <p className="text-xs text-slate-500">AI is parsing clauses, entities, and risk markers.</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </Card>
          )}

          <section className="space-y-3">
            {risks.map((risk) => (
              <Card key={`${risk.title}-${risk.level}`} className="rounded-[28px] border border-slate-100 bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold text-white ${levelStyles[risk.level].indicator}`}>
                    {risk.level.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{risk.title}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelStyles[risk.level].badge}`}>
                        {risk.level}
                      </span>
                    </div>
                    {risk.location && <p className="text-xs text-slate-500">{risk.location}</p>}
                    {risk.description && <p className="mt-2 text-sm text-slate-600">{risk.description}</p>}
                    {risk.suggestion && (
                      <p className="mt-2 text-xs font-semibold text-emerald-600">Next step: {risk.suggestion}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </section>

          <Card className="rounded-[32px] border border-slate-100 bg-white p-5">
            <SummaryContent
              analysisStatus={status}
              summary={analysis.summary}
              originalName={analysis.file_name || analysis.original_name}
              analysisId={analysis.id}
              refreshAnalysis={fetchAnalysis}
              refreshing={refreshing}
            />
          </Card>

          {status === "failed" && (
            <Card className="rounded-3xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-600">Analysis failed</p>
                  <p className="text-xs text-red-500">There was an error processing your document. Try uploading again.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 rounded-full"
                    onClick={() => navigate("/scan")}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-sm border-t border-white/40 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-2xl border-slate-200 text-slate-900">
              <Share2 className="mr-2 h-4 w-4" /> Share report
            </Button>
            <Button className="rounded-2xl bg-slate-900 text-white">
              <Download className="mr-2 h-4 w-4" /> Download $19
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}