
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { useNavigate } from "react-router-dom";

type AnalysisItemProps = {
  analysis: {
    id: string;
    original_name: string;
    created_at: string;
    analysis_status: string;
    summary?: string;
  };
};

export const AnalysisItem = ({ analysis }: AnalysisItemProps) => {
  const navigate = useNavigate();
  
  const viewSummary = () => {
    navigate(`/document/${analysis.id}/summary`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <FileText className="h-6 w-6 text-blue-500 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium">{analysis.original_name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(analysis.created_at).toLocaleDateString()} {new Date(analysis.created_at).toLocaleTimeString()}
            </p>
            <div className="mt-2">
              {analysis.analysis_status === 'pending' ? (
                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">AI is analyzing your document...</p>
                </div>
              ) : analysis.analysis_status === 'failed' ? (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  Analysis failed. Please try uploading again.
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
                    <p className="font-medium text-primary mb-1">AI Summary:</p>
                    {analysis.summary ? (
                      <p className="line-clamp-3">{analysis.summary}</p>
                    ) : (
                      <p className="text-gray-500">No summary available</p>
                    )}
                  </div>
                  {analysis.summary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs" 
                      onClick={viewSummary}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full Summary
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4">
          <StatusIcon status={analysis.analysis_status} />
        </div>
      </div>
    </Card>
  );
};
