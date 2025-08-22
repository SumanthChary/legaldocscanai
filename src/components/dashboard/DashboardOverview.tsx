import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { EnhancedInsights } from "./EnhancedInsights";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useAnalyticsStats } from "./useAnalyticsStats";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { Card } from "@/components/ui/card";
import { TrendingUp, FileText, Clock, Target } from "lucide-react";
import { WeeklyTrendChart, RiskDistributionChart, PerformanceChart } from "./OptimizedCharts";

type DashboardOverviewProps = {
  session: any;
  onTabChange: (tab: string) => void;
};

const DashboardOverview = ({ session, onTabChange }: DashboardOverviewProps) => {
  const navigate = useNavigate();
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const { analysisStats, isLoading: statsLoading } = useAnalyticsStats(session?.user?.id);

  const quickStatsCards = [
    {
      title: "Documents Analyzed",
      value: analysisStats.totalDocuments.toString(),
      icon: FileText,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Average Score",
      value: `${analysisStats.averageScore}%`,
      icon: Target,
      trend: "+5%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Time Saved",
      value: "24h",
      icon: Clock,
      trend: "+18%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Improvement Rate",
      value: `${analysisStats.improvementRate}%`,
      icon: TrendingUp,
      trend: "+8%",
      trendUp: true,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 w-full max-w-full overflow-hidden">
      {/* Upgrade Banner */}
      {showUpgradeBanner && (
        <InView
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full max-w-full">
            <UpgradeBanner
              buttonText="Upgrade Now"
              description="for unlimited document analysis and advanced features"
              onClose={() => setShowUpgradeBanner(false)}
              onClick={() => navigate("/pricing")}
            />
          </div>
        </InView>
      )}

      {/* Header Section */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 w-full max-w-full">
          <div className="flex-1 min-w-0">
            <WelcomeHeader session={session} />
          </div>
          <div className="flex-shrink-0">
            <QuickActions onTabChange={onTabChange} />
          </div>
        </div>
      </InView>

      {/* Quick Stats Grid */}
      <InView
        variants={{
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1 }
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 w-full max-w-full">
          {quickStatsCards.map((stat, index) => (
            <Card key={stat.title} className="p-3 sm:p-4 md:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur min-w-0 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate leading-tight">{stat.title}</p>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-xs sm:text-sm font-medium truncate ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-2`}>
                  <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </InView>

      {/* Enhanced Insights */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <EnhancedInsights userId={session?.user?.id || ""} />
      </InView>

      {/* Activity and Performance Grid */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
          <div className="lg:col-span-2 min-w-0">
            <RecentActivity isLoading={statsLoading} />
          </div>
          <div className="lg:col-span-1 min-w-0">
            <PerformanceMetrics isLoading={statsLoading} />
          </div>
        </div>
      </InView>

      {/* Advanced Analytics Charts */}
      <InView
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 w-full max-w-full">
          <div className="min-w-0">
            <WeeklyTrendChart />
          </div>
          <div className="min-w-0">
            <RiskDistributionChart />
          </div>
          <div className="min-w-0 md:col-span-2 xl:col-span-1">
            <PerformanceChart />
          </div>
        </div>
      </InView>
    </div>
  );
};

export default DashboardOverview;