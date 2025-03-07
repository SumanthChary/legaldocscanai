
import { useState } from "react";
import { FileText, AlertTriangle, RefreshCw, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import { StatusBadge } from "./StatusBadge";

interface DocumentCardProps {
  doc: any;
  expandedDocs: string[];
  toggleSummary: (docId: string) => void;
}

export const DocumentCard = ({ doc, expandedDocs, toggleSummary }: DocumentCardProps) => {
  const isExpanded = expandedDocs.includes(doc.id);

  return (
    <InView>
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {doc.original_name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(doc.created_at).toLocaleDateString()} 
                {' • '}
                {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <div className="mt-2">
                <StatusBadge status={doc.analysis_status} />
              </div>
            </div>
          </div>

          {doc.analysis_status === 'completed' && doc.summary && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50"
                onClick={() => toggleSummary(doc.id)}
              >
                <span className="text-sm font-medium">
                  {isExpanded ? "Hide AI Summary" : "Show AI Summary"}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {isExpanded && (
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  {doc.summary}
                </div>
              )}
            </div>
          )}

          {doc.analysis_status === 'pending' && (
            <div className="text-sm text-yellow-600 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>AI is analyzing your document...</span>
              </div>
            </div>
          )}

          {doc.analysis_status === 'failed' && (
            <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Analysis failed. Please try uploading again.</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </InView>
  );
};
