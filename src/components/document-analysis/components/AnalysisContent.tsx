
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { AnalysisActions } from "./AnalysisActions";

interface AnalysisContentProps {
  analysis: {
    id: string;
    original_name: string;
    created_at: string;
    analysis_status: string;
    summary?: string;
    is_deleted?: boolean;
  };
  isRestoring?: boolean;
  isRefreshing?: boolean;
  showRestore?: boolean;
  onRestore?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onViewSummary?: () => void;
}

export const AnalysisContent = ({
  analysis,
  isRestoring,
  isRefreshing,
  showRestore,
  onRestore,
  onDelete,
  onRefresh,
  onViewSummary
}: AnalysisContentProps) => {
  const canShowSummary = analysis.analysis_status === 'completed' && !analysis.is_deleted;
  const hasSummary = analysis.summary && analysis.summary.trim().length > 0 && 
                     analysis.summary !== 'null' && analysis.summary !== 'undefined';

  if (analysis.analysis_status === 'pending' && !analysis.is_deleted) {
    return (
      <div className="mt-2">
        <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm">Lightning AI analysis in progress...</p>
        </div>
      </div>
    );
  }

  if (analysis.analysis_status === 'failed') {
    return (
      <div className="mt-2">
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
          Analysis failed. Please try uploading again.
        </div>
      </div>
    );
  }

  if (!analysis.is_deleted) {
    return (
      <div className="mt-2">
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
          <p className="font-medium text-primary mb-1">Lightning AI Summary:</p>
          {hasSummary ? (
            <p className="line-clamp-3">{analysis.summary}</p>
          ) : (
            <div className="text-red-600">
              <p>⚠️ No summary available</p>
              <AnalysisActions 
                isRefreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            </div>
          )}
        </div>
        {canShowSummary && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={onViewSummary}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Full Analysis
          </Button>
        )}
      </div>
    );
  }

  return null;
};
