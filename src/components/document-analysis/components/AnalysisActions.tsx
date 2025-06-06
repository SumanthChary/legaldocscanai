
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Loader2 } from "lucide-react";

interface AnalysisActionsProps {
  isDeleted?: boolean;
  isRestoring?: boolean;
  isRefreshing?: boolean;
  showRestore?: boolean;
  onRestore?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
}

export const AnalysisActions = ({
  isDeleted,
  isRestoring,
  isRefreshing,
  showRestore,
  onRestore,
  onDelete,
  onRefresh
}: AnalysisActionsProps) => {
  if (showRestore && isDeleted) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRestore}
          disabled={isRestoring}
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          {isRestoring ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Restore"
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!isDeleted) {
    return (
      <div className="flex gap-2">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs"
          >
            {isRefreshing ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3 mr-1" />
            )}
            Refresh
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-gray-500 hover:text-red-500 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Move to trash</span>
        </Button>
      </div>
    );
  }

  return null;
};
