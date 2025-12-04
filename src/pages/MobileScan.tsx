import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Sparkles, Timer, Lock } from "lucide-react";
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
    <MobileLayout showNavigation={false} className="bg-[#e8f8f0]">
      <div className="flex min-h-screen flex-col gap-5 bg-gradient-to-b from-[#e8f8f0] via-[#d1f2e0] to-[#0b1f18] px-5 pb-10 pt-6 text-white">
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-200">Camera scan</p>
          <div className="rounded-[40px] border border-white/10 bg-black/50 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
            <DocumentScanner
              variant="inline"
              autoCloseOnConfirm={false}
              onScan={handleScanComplete}
              onClose={() => navigate(-1)}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.5em] text-emerald-200">Secure capture</p>
          <p className="text-lg font-semibold text-white">
            LegalDeep AI encrypts every frame, strips metadata, and auto-purges scans in 24 hours.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
              <Shield className="h-4 w-4 text-emerald-300" /> SOC 2 guardrails
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
              <Sparkles className="h-4 w-4 text-emerald-300" /> Edge clean-up
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
              <Timer className="h-4 w-4 text-emerald-300" /> 30s OCR
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
              <Lock className="h-4 w-4 text-emerald-300" /> Zero-retention
            </span>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-4 rounded-[32px] border border-emerald-300/30 bg-[#08231b] p-5 shadow-inner">
            <div className="text-xs uppercase tracking-[0.45em] text-emerald-200">Analyzing</div>
            <p className="text-lg font-semibold text-white">{capturedFileName ?? "Captured contract"}</p>
            <p className="text-sm text-emerald-100/80">Preparing clauses, risks, and key terms in seconds.</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-100/70">
                <span>Lightning review</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2 bg-white/10" />
            </div>
          </div>
        )}

        {uploadError && (
          <div className="rounded-3xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">
            {uploadError}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}