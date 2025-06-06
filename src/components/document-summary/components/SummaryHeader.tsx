
import { AlertTriangle, Info, Shield, Zap } from "lucide-react";
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isEmergencyProcessing ? 'bg-yellow-500' : 'bg-gradient-to-r from-green-600 to-blue-600'}`}>
            {isEmergencyProcessing ? (
              <AlertTriangle className="h-5 w-5 text-white" />
            ) : (
              <Zap className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {isEmergencyProcessing ? "⚠️ Emergency Analysis Results" : "⚡ Lightning AI Analysis Results"}
            </h2>
            <p className="text-gray-600">
              {isEmergencyProcessing ? "Document processed in emergency mode" : "Professional document analysis completed in seconds!"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <StatusBadge status={analysisStatus} />
          <SummaryActions summary={summary} originalName={originalName} />
        </div>
      </div>

      {!isEmergencyProcessing && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">⚡ Lightning Professional AI Analysis Complete</p>
              <p>
                This comprehensive analysis was generated using our ultra-fast AI technology with GroqCloud and Gemini APIs. 
                Optimized for {fileType} files and all document types. 
                Results are professionally formatted and ready for immediate business use.
              </p>
            </div>
          </div>
        </div>
      )}

      {isEmergencyProcessing && (
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Emergency Processing Mode</p>
              <p>
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
