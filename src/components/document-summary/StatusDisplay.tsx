
import { RefreshCw, AlertTriangle } from "lucide-react";

interface StatusDisplayProps {
  analysisStatus?: string;
}

export const StatusDisplay = ({ analysisStatus }: StatusDisplayProps) => {
  if (!analysisStatus) return null;

  switch (analysisStatus) {
    case 'pending':
      return (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-md mb-6">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <p>AI is currently analyzing your document. This may take a few minutes...</p>
        </div>
      );
    case 'failed':
      return (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-md mb-6">
          <AlertTriangle className="h-5 w-5" />
          <p>Analysis failed. Please try uploading your document again.</p>
        </div>
      );
    default:
      return null;
  }
};
