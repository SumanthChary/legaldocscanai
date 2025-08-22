
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { InView } from "@/components/ui/in-view";

type PerformanceMetricsProps = {
  isLoading?: boolean;
};

export const PerformanceMetrics = ({ isLoading = false }: PerformanceMetricsProps) => {
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4 md:p-6 h-full">
        <Skeleton className="h-4 sm:h-5 md:h-6 w-20 sm:w-24 md:w-32 mb-3 md:mb-4" />
        <div className="space-y-3 md:space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 md:w-24" />
              <Skeleton className="h-3 sm:h-4 w-8 sm:w-10 md:w-12" />
            </div>
            <Skeleton className="h-1.5 sm:h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-3 sm:h-4 w-18 sm:w-22 md:w-28" />
              <Skeleton className="h-3 sm:h-4 w-8 sm:w-10 md:w-12" />
            </div>
            <Skeleton className="h-1.5 sm:h-2 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <InView
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-3 sm:p-4 md:p-6 h-full">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4 truncate">Performance</h2>
        <div className="space-y-3 md:space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
              <span className="truncate flex-1 pr-2">Analysis Speed</span>
              <span className="text-green-500 font-medium flex-shrink-0">+12%</span>
            </div>
            <Progress value={78} className="h-1.5 sm:h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
              <span className="truncate flex-1 pr-2">Accuracy Rate</span>
              <span className="text-blue-500 font-medium flex-shrink-0">99%</span>
            </div>
            <Progress value={99} className="h-1.5 sm:h-2" />
          </div>
        </div>
      </Card>
    </InView>
  );
};
