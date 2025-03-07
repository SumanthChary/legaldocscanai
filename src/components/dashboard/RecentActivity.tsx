
import { Activity, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";

export const RecentActivity = () => {
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
  );
};
