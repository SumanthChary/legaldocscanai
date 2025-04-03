
import { Activity, BarChart, Clock, FileText, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

type AnalyticsStats = {
  totalDocuments: number;
  averageScore: number;
  improvementRate: number;
};

type StatsCardsProps = {
  stats: AnalyticsStats;
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card key={0} className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <FileText className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold">{stats.totalDocuments.toString()}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Documents Analyzed</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-4 w-4 mr-1 text-success" />
          <span className="text-success">+12% from last month</span>
        </div>
      </Card>

      <Card key={1} className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <BarChart className="h-8 w-8 text-success" />
          <span className="text-2xl font-bold">${stats.averageScore}%</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Analysis Score</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-4 w-4 mr-1 text-success" />
          <span className="text-success">+5% improvement</span>
        </div>
      </Card>

      <Card key={2} className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <Clock className="h-8 w-8 text-warning" />
          <span className="text-2xl font-bold">2.5s</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Processing Time</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-4 w-4 mr-1 text-warning" />
          <span className="text-warning">-30% faster</span>
        </div>
      </Card>

      <Card key={3} className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <Target className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">99%</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Accuracy Rate</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-4 w-4 mr-1 text-success" />
          <span className="text-success">Consistent</span>
        </div>
      </Card>
    </div>
  );
};
