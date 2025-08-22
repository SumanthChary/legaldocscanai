
import { Activity, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InView } from "@/components/ui/in-view";

type RecentActivityProps = {
  isLoading?: boolean;
};

export const RecentActivity = ({ isLoading = false }: RecentActivityProps) => {
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

  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4 md:p-6">
        <Skeleton className="h-5 sm:h-6 w-28 sm:w-36 mb-3 sm:mb-4" />
        <div className="space-y-3 sm:space-y-4">
          {[1, 2].map((_, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-3 sm:h-4 w-32 sm:w-40 mb-1 sm:mb-2" />
                <Skeleton className="h-2 sm:h-3 w-20 sm:w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <InView
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-3 sm:p-4 md:p-6">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 sm:gap-4">
              <div className={`p-1.5 sm:p-2 rounded-full bg-gray-100 ${activity.color} flex-shrink-0`}>
                <activity.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </InView>
  );
};
