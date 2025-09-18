import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, RefreshCw, Download, Copy, BarChart3, MoreVertical, Share } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SummaryDisplay } from "./components/SummaryDisplay";
import { DocumentMetricsCharts } from "./components/DocumentMetricsCharts";
import { useDocumentMetrics } from "./hooks/useDocumentMetrics";
import { toast } from "@/hooks/use-toast";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { useFeedbackTrigger } from "@/hooks/useFeedbackTrigger";
import { useState } from "react";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
  originalName?: string;
  analysisId?: string;
  refreshAnalysis?: () => void;
  refreshing?: boolean;
}

export const SummaryContent = ({ analysisStatus, summary, originalName, analysisId, refreshAnalysis, refreshing }: SummaryContentProps) => {
  const isCompleted = analysisStatus === 'completed';
  const { showFeedback, closeFeedback } = useFeedbackTrigger(analysisId || '', isCompleted);
  const [showMetrics, setShowMetrics] = useState(false);
  
  // Generate document metrics when summary is available
  const metrics = useDocumentMetrics(summary || '', originalName || '');

  if (analysisStatus !== 'completed') {
    return null;
  }

  if (!summary || summary.trim().length === 0 || summary === 'null' || summary === 'undefined') {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    toast({ title: "Copied to clipboard", description: "Summary has been copied to your clipboard." });
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalName}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Combined Header Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* File Info Header */}
        <div className="border-b border-gray-100 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-editorial-new font-medium text-gray-900">Summary</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-editorial-new">Professional Legal Analysis</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-900 font-editorial-new">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={refreshAnalysis} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Summary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowMetrics(!showMetrics)}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  {showMetrics ? 'Hide Analytics' : 'Show Analytics'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Link copied", description: "Document link copied to clipboard" });
                }}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Emergency Processing Warning */}
        {isEmergencyProcessing && (
          <div className="border-b border-gray-100 px-4 sm:px-6 py-4 bg-yellow-50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-editorial-new font-medium text-yellow-800 mb-1">Emergency Processing Mode</p>
                <p className="text-yellow-700 font-editorial-new">
                  Document processed in emergency mode. For enhanced analysis, try re-uploading.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Content */}
        <div className="p-4 sm:p-6">
          <SummaryDisplay 
            summary={summary}
            isEmergencyProcessing={isEmergencyProcessing}
          />
        </div>
      </div>

      {/* Document Analytics Section */}
      {showMetrics && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-editorial-new font-medium text-gray-900 mb-4">Document Analytics</h3>
          <DocumentMetricsCharts 
            metrics={metrics}
            fileName={originalName || 'document'}
          />
        </div>
      )}

      <FeedbackModal
        open={showFeedback}
        onClose={closeFeedback}
        analysisId={analysisId || ''}
      />
    </div>
  );
};
