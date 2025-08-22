
import { BarChart, Clock, FileText, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InView } from "@/components/ui/in-view";
import { Skeleton } from "@/components/ui/skeleton";

type AnalyticsStats = {
  totalDocuments: number;
  averageScore: number;
  improvementRate: number;
};

type AnalyticsCardsProps = {
  stats: AnalyticsStats;
  isLoading?: boolean;
};

export const AnalyticsCards = ({ stats, isLoading = false }: AnalyticsCardsProps) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <InView 
          key={index} 
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
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
        </InView>
      ))}
    </div>
  );
};
