
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
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
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
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Performance</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Analysis Speed</span>
              <span className="text-green-500">+12%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Accuracy Rate</span>
              <span className="text-blue-500">99%</span>
            </div>
            <Progress value={99} className="h-2" />
          </div>
        </div>
      </Card>
    </InView>
  );
};
