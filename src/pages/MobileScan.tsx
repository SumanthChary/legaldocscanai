import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, Timer, Lock, ArrowLeft, Check } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { DocumentScanner } from "@/components/document-analysis/upload/DocumentScanner";
import { useFileUpload } from "@/components/document-analysis/upload/useFileUpload";
import { Progress } from "@/components/ui/progress";

export default function MobileScan() {
  const navigate = useNavigate();
  const { handleUpload, isUploading, uploadProgress, uploadError } = useFileUpload(() => {
    navigate("/history");
  });
  const [capturedFileName, setCapturedFileName] = useState<string | null>(null);

  const handleScanComplete = async (scannedFile: File) => {
    setCapturedFileName(scannedFile.name);
    await handleUpload(scannedFile);
  };

  return (
    <MobileLayout showNavigation={false} className="bg-[#F4F7F5]">
      <div className="flex min-h-screen flex-col gap-5 bg-[#F4F7F5] px-4 pb-10 pt-6">
        <header className="flex items-center justify-between text-slate-600">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white">
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Scanning contract</p>
            <p className="font-display text-xl text-slate-900">High quality</p>
          </div>
          <div className="text-xs font-semibold text-emerald-600">95% OCR</div>
        </header>

        <DocumentScanner
          variant="inline"
          autoCloseOnConfirm={false}
          onScan={handleScanComplete}
          onClose={() => navigate(-1)}
        />

        <div className="rounded-[32px] border border-slate-100 bg-white p-5 text-slate-900">
          <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Secure capture</p>
          <p className="mt-2 text-sm text-slate-500">
            LegalDeep encrypts every frame, strips metadata, and auto-deletes scans after 24h. Use "Upload from photos" to bring in an existing contract image.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><Shield className="h-4 w-4 text-emerald-500" /> SOC2-ready</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><Sparkles className="h-4 w-4 text-emerald-500" /> Edge clean-up</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><Timer className="h-4 w-4 text-emerald-500" /> 30s OCR</span>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2"><Lock className="h-4 w-4 text-emerald-500" /> Zero retention</span>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Process scan</p>
              <p className="text-lg font-semibold text-slate-900">$19 per scan</p>
            </div>
            <button
              onClick={() => navigate("/payment", { state: { plan: { name: "Scan Plan", price: "$19", period: "per scan" } } })}
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Process scan
            </button>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-4 rounded-[32px] border border-emerald-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
              <Check className="h-4 w-4" /> Analyzing
            </div>
            <p className="text-base font-semibold text-slate-900">{capturedFileName ?? "Captured contract"}</p>
            <p className="text-sm text-slate-500">Preparing clauses, risks, and key terms.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Lightning review</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}

        {uploadError && (
          <div className="rounded-3xl border border-red-200 bg-white p-4 text-sm text-red-600">
            {uploadError}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}