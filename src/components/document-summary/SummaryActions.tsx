
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
    <div className="flex gap-2 w-full sm:w-auto">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={refreshAnalysis}
        disabled={refreshing}
        className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3"
      >
        <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
        <span className="hidden xs:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        <span className="xs:hidden">{refreshing ? '...' : 'Refresh'}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3"
        onClick={handleShareClick}
      >
        <Share className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden xs:inline">Share</span>
        <span className="xs:hidden">Share</span>
      </Button>
    </div>
  );
};
