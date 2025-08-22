
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <Card key={0} className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-accent flex-shrink-0" />
          <span className="text-lg sm:text-2xl font-bold">{stats.totalDocuments.toString()}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 truncate">Documents Analyzed</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-success flex-shrink-0" />
          <span className="text-success truncate">+12% from last month</span>
        </div>
      </Card>

      <Card key={1} className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <BarChart className="h-6 w-6 sm:h-8 sm:w-8 text-success flex-shrink-0" />
          <span className="text-lg sm:text-2xl font-bold">{stats.averageScore}%</span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 truncate">Analysis Score</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-success flex-shrink-0" />
          <span className="text-success truncate">+5% improvement</span>
        </div>
      </Card>

      <Card key={2} className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning flex-shrink-0" />
          <span className="text-lg sm:text-2xl font-bold">2.5s</span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 truncate">Processing Time</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-warning flex-shrink-0" />
          <span className="text-warning truncate">-30% faster</span>
        </div>
      </Card>

      <Card key={3} className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <Target className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
          <span className="text-lg sm:text-2xl font-bold">99%</span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2 truncate">Accuracy Rate</h3>
        <div className="flex items-center text-xs">
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-success flex-shrink-0" />
          <span className="text-success truncate">Consistent</span>
        </div>
      </Card>
    </div>
  );
};
