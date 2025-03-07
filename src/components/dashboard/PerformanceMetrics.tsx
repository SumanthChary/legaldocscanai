
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const PerformanceMetrics = () => {
  return (
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
  );
};
