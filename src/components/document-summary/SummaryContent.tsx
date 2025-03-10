
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Info } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
  originalName?: string;
}

export const SummaryContent = ({ analysisStatus, summary, originalName }: SummaryContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Detect if this is likely a fallback message
  const isFallbackMessage = summary.includes("unable to generate") || 
                           summary.includes("couldn't process") ||
                           summary.includes("encountered difficulties") ||
                           summary.includes("encountered challenges");

  // Determine file type for specific suggestions
  const getFileType = () => {
    if (!originalName) return 'document';
    
    const extension = originalName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF';
      case 'doc': 
      case 'docx': return 'Word document';
      case 'txt': return 'text file';
      default: return 'document';
    }
  };

  const fileType = getFileType();

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
        <div className={`bg-accent/5 p-4 rounded-lg border ${isFallbackMessage ? 'border-yellow-200 bg-yellow-50' : 'border-accent/10'} text-gray-700 whitespace-pre-line`}>
          {summary}
          
          {isFallbackMessage && (
            <div className="mt-4 pt-4 border-t border-yellow-200 text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-700">Processing challenges with your {fileType}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-yellow-700">
                    {fileType === 'PDF' && (
                      <>
                        <li>This PDF may contain scanned text or images that can't be processed</li>
                        <li>Try using an OCR tool to convert it to a searchable PDF first</li>
                        <li>Consider copying the text manually into a plain text (.txt) file</li>
                      </>
                    )}
                    {fileType.includes('Word') && (
                      <>
                        <li>This Word document may contain complex formatting or embedded objects</li>
                        <li>Try saving it as a plain text (.txt) file and upload again</li>
                        <li>Remove any images, tables, or special formatting</li>
                      </>
                    )}
                    {fileType === 'text file' && (
                      <>
                        <li>The text file may contain unusual formatting or characters</li>
                        <li>Check for and remove any non-standard characters</li>
                      </>
                    )}
                    <li>If the document is large, try with a smaller section (1-3 pages)</li>
                    <li>For complex documents, break them into smaller logical sections</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {!isFallbackMessage && summary.length > 500 && (
            <div className="mt-4 pt-4 border-t border-blue-100 text-sm text-blue-700">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p>
                  This summary was generated based on the extracted text content of your {fileType}.
                  For complex documents, some formatting or visual elements may not be fully reflected.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
