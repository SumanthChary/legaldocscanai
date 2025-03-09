
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DocumentHeaderProps {
  refreshAnalysis: () => void;
  refreshing: boolean;
  analysisStatus?: string;
}

export const DocumentHeader = ({ refreshAnalysis, refreshing, analysisStatus }: DocumentHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshAnalysis}
          disabled={refreshing || analysisStatus === 'pending'}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "Document link copied to clipboard",
            });
          }}
        >
          <Share className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
