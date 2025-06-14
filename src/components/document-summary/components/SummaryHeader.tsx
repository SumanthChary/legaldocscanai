
import { AlertTriangle, Info, Shield, FileText } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { SummaryActions } from "./SummaryActions";

interface SummaryHeaderProps {
  analysisStatus?: string;
  summary: string;
  originalName?: string;
  isEmergencyProcessing: boolean;
}

export const SummaryHeader = ({ 
  analysisStatus, 
  summary, 
  originalName, 
  isEmergencyProcessing 
}: SummaryHeaderProps) => {
  const getFileType = () => {
    if (!originalName) return 'document';
    
    const extension = originalName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'doc': 
      case 'docx': return 'Word document';
      case 'txt': return 'text file';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp': return 'image';
      default: return 'document';
    }
  };

  const fileType = getFileType();

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          <img 
            src="/lovable-uploads/d6ebe86c-0ed9-45ec-b3c9-e8ba54148009.png" 
            alt="Legal Analysis" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent break-words">
              {isEmergencyProcessing ? "⚠️ Emergency Analysis Results" : "AI Analysis Results"}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              {isEmergencyProcessing ? "Document processed in emergency mode" : "Professional document analysis completed"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <StatusBadge status={analysisStatus} />
          <SummaryActions summary={summary} originalName={originalName} />
        </div>
      </div>

      {isEmergencyProcessing && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-yellow-800 min-w-0">
              <p className="font-semibold mb-1">Emergency Processing Mode</p>
              <p className="break-words">
                Your document was processed using emergency mode to ensure you receive immediate results. 
                For enhanced AI analysis, you can try re-uploading the document.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
