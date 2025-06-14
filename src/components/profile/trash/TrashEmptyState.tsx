
import { Trash2 } from "lucide-react";

export const TrashEmptyState = () => {
  return (
    <div className="text-center py-6 sm:py-8">
      <Trash2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Trash is empty</h3>
      <p className="text-xs sm:text-sm text-gray-500 px-4">
        Deleted documents will appear here and can be restored or permanently deleted.
      </p>
    </div>
  );
};
