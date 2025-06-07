
import { Button } from "@/components/ui/button";
import { Download, Copy, CheckCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface SummaryActionsProps {
  summary: string;
  originalName?: string;
}

export const SummaryActions = ({ summary, originalName }: SummaryActionsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 sm:gap-2 hover:bg-blue-50 border-blue-200 text-xs sm:text-sm px-2 sm:px-3"
        onClick={handleCopy}
      >
        {copied ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
        <span className="hidden xs:inline">{copied ? "Copied" : "Copy"}</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 sm:gap-2 hover:bg-purple-50 border-purple-200 text-xs sm:text-sm px-2 sm:px-3"
        onClick={handleDownload}
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Download</span>
      </Button>
    </div>
  );
};
