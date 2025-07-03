
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type PDFViewerProps = {
  documentPath: string;
  documentName: string;
};

export function PDFViewer({ documentPath, documentName }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const { toast } = useToast();

  const handleViewPDF = async () => {
    if (pdfUrl) {
      setIsViewing(!isViewing);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("esignatures")
        .createSignedUrl(documentPath, 3600); // 1 hour expiry

      if (error) throw error;
      
      setPdfUrl(data.signedUrl);
      setIsViewing(true);
    } catch (error: any) {
      toast({ title: "Failed to load PDF", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
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
    } catch (error: any) {
      toast({ title: "Download failed", description: error.message, variant: "destructive" });
    }
  };

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
          {isViewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {loading ? "Loading..." : isViewing ? "Hide PDF" : "View PDF"}
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      
      {isViewing && pdfUrl && (
        <div className="border rounded-lg overflow-hidden bg-white">
          <iframe
            src={pdfUrl}
            className="w-full h-96 border-0"
            title={`PDF Viewer - ${documentName}`}
          />
        </div>
      )}
    </div>
  );
}
