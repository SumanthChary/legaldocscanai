
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
}

export const SummaryContent = ({ analysisStatus, summary }: SummaryContentProps) => {
  if (analysisStatus !== 'completed' || !summary) {
    return null;
  }

  const handleDownload = () => {
    // Create a blob with the summary text
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">AI Summary</h2>
          <div className="flex gap-4 items-center">
            <StatusBadge status={analysisStatus} />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 text-gray-700 whitespace-pre-line">
          {summary}
        </div>
      </div>
    </div>
  );
};
