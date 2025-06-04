
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Info, ChevronDown, ChevronUp, Copy, CheckCircle, FileText, Shield } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface SummaryContentProps {
  analysisStatus?: string;
  summary?: string | null;
  originalName?: string;
}

export const SummaryContent = ({ analysisStatus, summary, originalName }: SummaryContentProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (analysisStatus !== 'completed' || !summary) {
    return null;
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalName ? originalName.split('.')[0] : 'document'}-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis downloaded",
      description: "The document analysis has been downloaded to your device.",
    });
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(summary)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "The analysis has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  }, [summary, toast]);

  const isFallbackMessage = summary.includes("unable to generate") || 
                           summary.includes("couldn't process") ||
                           summary.includes("encountered difficulties") ||
                           summary.includes("Processing challenges") ||
                           summary.includes("Emergency Processing");

  const formattedSummary = formatSummary(summary);

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
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Lightning AI Analysis Results
              </h2>
              <p className="text-gray-600">Professional document analysis powered by GroqCloud AI</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <StatusBadge status={analysisStatus} />
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 hover:bg-purple-50 border-purple-200"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        
        <div className={`relative ${isExpanded ? '' : 'max-h-80 overflow-hidden'}`}>
          <div className={`p-6 rounded-xl border text-gray-700 whitespace-pre-line ${
            isFallbackMessage 
              ? 'border-yellow-200 bg-yellow-50' 
              : 'border-blue-100 bg-gradient-to-br from-blue-50/50 to-purple-50/50'
          }`}>
            {formattedSummary}
            
            {!isExpanded && summary.length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent rounded-b-xl"></div>
            )}
          </div>
        </div>
        
        {!isFallbackMessage && summary.length > 500 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center hover:bg-blue-50"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show Full Analysis
              </>
            )}
          </Button>
        )}
        
        {!isFallbackMessage && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Lightning Professional AI Analysis Complete</p>
                <p>
                  This comprehensive analysis was generated using GroqCloud's advanced AI technology optimized for speed and accuracy. 
                  Perfect for {fileType} files and all document types. 
                  Results are professionally formatted and ready for business use.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function formatSummary(text: string): string {
  const hasStructure = /#+\s|^\d+\.\s|\n\s*[-•*]\s|\n\s*\d+\.\s/m.test(text);
  
  if (hasStructure) {
    return text
      .replace(/\n#+\s/g, '\n\n$&')
      .replace(/(\n\s*[-•*]\s.*?)(\n[^-•*\s])/g, '$1\n$2')
      .replace(/(\n\s*\d+\.\s.*?)(\n[^\d\s])/g, '$1\n$2');
  }
  
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([.!?])\s+/g, '$1\n\n')
    .replace(/\n{3,}/g, '\n\n');
}
