
import { Card } from "@/components/ui/card";
import { Clock, Target, TrendingUp, Zap } from "lucide-react";

export const InsightCards = () => {
  const insights = [
    {
      title: "Processing Speed",
      value: "2.5x",
      icon: Zap,
      description: "Faster than manual review"
    },
    {
      title: "Quality Score",
      value: "92%",
      icon: Target,
      description: "Document quality rating"
    },
    {
      title: "Success Rate",
      value: "98%",
      icon: TrendingUp,
      description: "Analysis completion rate"
    },
    {
      title: "Time Saved",
      value: "75%",
      icon: Clock,
      description: "Compared to manual process"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {insights.map((insight, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <insight.icon className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">{insight.value}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{insight.title}</h3>
          <p className="text-xs text-gray-500">{insight.description}</p>
        </Card>
      ))}
    </div>
  );
};
