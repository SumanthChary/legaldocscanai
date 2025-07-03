
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type PDFViewerProps = {
  documentPath: string;
  documentName: string;
};

export function PDFViewer({ documentPath, documentName }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { toast } = useToast();

  const handleViewPDF = useCallback(async () => {
    if (pdfUrl) {
      setIsViewing(!isViewing);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("esignatures")
        .createSignedUrl(documentPath, 3600);

      if (error) throw error;
      
      setPdfUrl(data.signedUrl);
      setIsViewing(true);
    } catch (error: any) {
      console.error("PDF loading error:", error);
      toast({ 
        title: "Failed to load PDF", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [documentPath, pdfUrl, isViewing, toast]);

  const handleDownload = useCallback(async () => {
    setDownloadLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("esignatures")
        .download(documentPath);

      if (error) throw error;

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: "Download completed!" });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({ 
        title: "Download failed", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setDownloadLoading(false);
    }
  }, [documentPath, documentName, toast]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={handleViewPDF}
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isViewing ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {loading ? "Loading..." : isViewing ? "Hide PDF" : "View PDF"}
        </Button>
        <Button
          onClick={handleDownload}
          disabled={downloadLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {downloadLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloadLoading ? "Downloading..." : "Download"}
        </Button>
      </div>
      
      {isViewing && pdfUrl && (
        <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            className="w-full h-96 border-0"
            title={`PDF Viewer - ${documentName}`}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
