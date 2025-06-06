
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, Info, ChevronDown, ChevronUp, Copy, CheckCircle, FileText, Shield, Zap } from "lucide-react";
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

  // Debug logging
  console.log("SummaryContent props:", { 
    analysisStatus, 
    summaryLength: summary?.length, 
    summaryExists: !!summary,
    summaryPreview: summary?.substring(0, 100),
    originalName 
  });

  if (analysisStatus !== 'completed') {
    console.log("Analysis not completed, status:", analysisStatus);
    return null;
  }

  // CRITICAL FIX: Better handling of empty/null summaries
  if (!summary || summary.trim().length === 0 || summary === 'null' || summary === 'undefined') {
    console.log("No valid summary available, summary:", summary);
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

  // Check for emergency/fallback messages
  const isEmergencyProcessing = summary.includes("EMERGENCY") || 
                               summary.includes("Emergency Processing") ||
                               summary.includes("emergency analysis mode") ||
                               summary.includes("Processing challenges");

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
            isEmergencyProcessing 
              ? 'border-yellow-200 bg-yellow-50' 
              : 'border-green-100 bg-gradient-to-br from-green-50/50 to-blue-50/50'
          }`}>
            {formattedSummary}
            
            {!isExpanded && summary.length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent rounded-b-xl"></div>
            )}
          </div>
        </div>
        
        {summary.length > 500 && (
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
      </div>
    </div>
  );
};

function formatSummary(text: string): string {
  // Clean up any formatting artifacts first
  let cleaned = text
    .replace(/^\s*---\s*$/gm, '') // Remove standalone --- lines
    .replace(/^#+\s*/gm, '') // Remove markdown headers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Remove bold/italic
    .trim();

  // Check if text has structure
  const hasStructure = /^\d+\.\s|\n\s*[-•*]\s|\n\s*\d+\.\s/m.test(cleaned);
  
  if (hasStructure) {
    return cleaned
      .replace(/\n{3,}/g, '\n\n')
      .replace(/(\n\s*[-•*]\s.*?)(\n[^-•*\s])/g, '$1\n$2')
      .replace(/(\n\s*\d+\.\s.*?)(\n[^\d\s])/g, '$1\n$2');
  }
  
  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n');
}
