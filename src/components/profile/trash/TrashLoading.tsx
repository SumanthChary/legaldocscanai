
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TrashLoading = () => {
  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
          <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
        </div>
        <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
      </div>
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3 sm:p-4">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <Skeleton className="h-5 w-5 sm:h-6 sm:w-6" />
              <div className="flex-1">
                <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
                <Skeleton className="h-3 sm:h-4 w-1/2 mb-2" />
                <Skeleton className="h-3 sm:h-4 w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
