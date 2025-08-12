import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  BarChart3, 
  Target, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Users
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface InsightsData {
  totalDocs: number;
  analyzedDocs: number;
  avgTime: number;
  accuracy: number;
  weeklyData: Array<{ day: string; documents: number; time: number }>;
  riskDistribution: Array<{ risk: string; count: number; color: string }>;
  monthlyTrends: {
    documentsGrowth: number;
    timeImprovement: number;
    accuracyChange: number;
  };
}

export const EnhancedInsights = ({ userId }: { userId: string }) => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Enhanced demo data with charts
  const demoData: InsightsData = {
    totalDocs: 156,
    analyzedDocs: 142,
    avgTime: 2.3,
    accuracy: 97.2,
    weeklyData: [
      { day: "Mon", documents: 12, time: 2.1 },
      { day: "Tue", documents: 18, time: 2.3 },
      { day: "Wed", documents: 15, time: 2.0 },
      { day: "Thu", documents: 22, time: 2.4 },
      { day: "Fri", documents: 19, time: 2.2 },
      { day: "Sat", documents: 8, time: 2.0 },
      { day: "Sun", documents: 5, time: 1.9 },
    ],
    riskDistribution: [
      { risk: "Low Risk", count: 89, color: "#22c55e" },
      { risk: "Medium Risk", count: 43, color: "#f59e0b" },
      { risk: "High Risk", count: 18, color: "#ef4444" },
      { risk: "Critical", count: 6, color: "#dc2626" },
    ],
    monthlyTrends: {
      documentsGrowth: 23.5,
      timeImprovement: -15.2,
      accuracyChange: 2.1,
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setInsights(demoData);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const completionRate = (insights.analyzedDocs / insights.totalDocs) * 100;

  return (
    <div className="space-y-8">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="flex items-center text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">+{insights.monthlyTrends.documentsGrowth}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{insights.totalDocs}</div>
          <div className="text-blue-700 font-medium">Total Documents</div>
          <div className="text-sm text-blue-600 mt-2">
            {insights.analyzedDocs} analyzed this month
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="flex items-center text-green-600">
              <ArrowUp className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">+{insights.monthlyTrends.accuracyChange}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-900">{insights.accuracy}%</div>
          <div className="text-green-700 font-medium">AI Accuracy</div>
          <Progress value={insights.accuracy} className="mt-3 h-2" />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="flex items-center text-green-600">
              <ArrowDown className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">{Math.abs(insights.monthlyTrends.timeImprovement)}% faster</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900">{insights.avgTime}m</div>
          <div className="text-purple-700 font-medium">Avg. Analysis Time</div>
          <div className="text-sm text-purple-600 mt-2">
            vs. 45m manual review
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-orange-600" />
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium ml-1">{completionRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-900">{insights.analyzedDocs}</div>
          <div className="text-orange-700 font-medium">Completed</div>
          <Progress value={completionRate} className="mt-3 h-2" />
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Weekly Document Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={insights.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === "documents" ? "Documents" : "Avg Time (min)"
                  ]}
                />
                <Bar dataKey="documents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insights.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {insights.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Documents"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {insights.riskDistribution.map((item) => (
                <div key={item.risk} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.risk}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">95.8%</div>
          <div className="text-gray-600 font-medium">Processing Success Rate</div>
          <div className="text-sm text-gray-500 mt-2">
            Industry average: 87%
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">24/7</div>
          <div className="text-gray-600 font-medium">Availability</div>
          <div className="text-sm text-gray-500 mt-2">
            99.9% uptime this month
          </div>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <div className="text-2xl font-bold text-gray-900">4.8x</div>
          <div className="text-gray-600 font-medium">Speed Improvement</div>
          <div className="text-sm text-gray-500 mt-2">
            Compared to manual review
          </div>
        </Card>
      </div>
    </div>
  );
};