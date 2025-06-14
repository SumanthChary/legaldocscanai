
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Archive } from "lucide-react";

type TrashHeaderProps = {
  documentCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onClearAll: () => void;
};

export const TrashHeader = ({ documentCount, isRefreshing, onRefresh, onClearAll }: TrashHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
      <div className="flex items-center">
        <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg mr-2 sm:mr-3">
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Trash</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {documentCount} document{documentCount !== 1 ? 's' : ''} in trash
          </p>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
        >
          <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden xs:inline">Refresh</span>
        </Button>
        {documentCount > 0 && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onClearAll}
            className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Clear All</span>
            <span className="xs:hidden">Clear</span>
          </Button>
        )}
      </div>
    </div>
  );
};
