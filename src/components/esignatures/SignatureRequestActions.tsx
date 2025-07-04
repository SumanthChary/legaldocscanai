
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SignatureRequestActionsProps = {
  request: {
    id: string;
    document_name: string;
    document_path: string;
    status: string;
  };
  onRefresh: () => void;
};

export function SignatureRequestActions({ request, onRefresh }: SignatureRequestActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("signature_requests")
        .delete()
        .eq("id", request.id);

      if (error) throw error;

      toast({ title: "Request deleted successfully" });
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error deleting request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("esignatures")
        .download(request.document_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = request.document_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Document downloaded" });
    } catch (error: any) {
      toast({
        title: "Error downloading document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="flex items-center gap-1"
      >
        <Download className="w-3 h-3" />
        Download
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        className="flex items-center gap-1 text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </Button>
    </div>
  );
}
