
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { SummaryHeader } from "./components/SummaryHeader";
import { SummaryDisplay } from "./components/SummaryDisplay";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
  originalName?: string;
}

export const SummaryContent = ({ analysisStatus, summary, originalName }: SummaryContentProps) => {
  console.log("SummaryContent props:", { 
    analysisStatus, 
    summaryLength: summary?.length, 
    summaryExists: !!summary,
    summaryPreview: summary?.substring(0, 100),
    originalName 
  });

  if (analysisStatus !== 'completed') {
    console.log("Analysis not completed, status:", analysisStatus);
    return null;
  }

  if (!summary || summary.trim().length === 0 || summary === 'null' || summary === 'undefined') {
    console.log("No valid summary available, summary:", summary);
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Analysis Processing Issue</h3>
              <p className="text-yellow-700">The document was processed but the summary is not available. Please try re-uploading the document.</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const isEmergencyProcessing = summary.includes("EMERGENCY") || 
                               summary.includes("Emergency Processing") ||
                               summary.includes("emergency analysis mode") ||
                               summary.includes("Processing challenges");

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6">
        <SummaryHeader 
          analysisStatus={analysisStatus}
          summary={summary}
          originalName={originalName}
          isEmergencyProcessing={isEmergencyProcessing}
        />
        
        <SummaryDisplay 
          summary={summary}
          isEmergencyProcessing={isEmergencyProcessing}
        />
      </div>
    </div>
  );
};
