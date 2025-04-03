
import { Card } from "@/components/ui/card";
import { Activity, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const ActivitySummary = () => {
  const recentActivities = [
    {
      title: "Document Analysis Completed",
      time: "2 hours ago",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "New Feature Available",
      time: "1 day ago",
      icon: Bell,
      color: "text-blue-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="col-span-2 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
    </div>
  );
};
