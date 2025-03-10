
import { Button } from "@/components/ui/button";
import { Share, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SummaryActionsProps {
  refreshAnalysis: () => void;
  refreshing: boolean;
  analysisId: string;
}

export const SummaryActions = ({ refreshAnalysis, refreshing, analysisId }: SummaryActionsProps) => {
  const { toast } = useToast();

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Document link copied to clipboard",
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshAnalysis}
        disabled={refreshing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleShareClick}
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};
