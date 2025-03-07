
import { BarChart, Clock, FileText, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

type AnalyticsStats = {
  totalDocuments: number;
  averageScore: number;
  improvementRate: number;
};

type AnalyticsCardsProps = {
  stats: AnalyticsStats;
};

export const AnalyticsCards = ({ stats }: AnalyticsCardsProps) => {
  const cards = [
    {
      title: "Documents Analyzed",
      value: stats.totalDocuments.toString(),
      icon: FileText,
      color: "text-accent",
      trend: "+12% from last month",
      trendColor: "text-success"
    },
    {
      title: "Analysis Score",
      value: `${stats.averageScore}%`,
      icon: BarChart,
      color: "text-success",
      trend: "+5% improvement",
      trendColor: "text-success"
    },
    {
      title: "Processing Time",
      value: "2.5s",
      icon: Clock,
      color: "text-warning",
      trend: "-30% faster",
      trendColor: "text-warning"
    },
    {
      title: "Accuracy Rate",
      value: "99%",
      icon: Target,
      color: "text-primary",
      trend: "Consistent",
      trendColor: "text-success"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <card.icon className={`h-8 w-8 ${card.color}`} />
            <span className="text-2xl font-bold">{card.value}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
          <div className="flex items-center text-xs">
            <TrendingUp className={`h-4 w-4 mr-1 ${card.trendColor}`} />
            <span className={card.trendColor}>{card.trend}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
