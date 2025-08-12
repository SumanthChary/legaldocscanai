import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, FileText, Clock, BarChart3, Target, Zap, CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
interface InsightsData {
  totalDocs: number;
  analyzedDocs: number;
  avgTime: number;
  accuracy: number;
  weeklyData: Array<{
    day: string;
    documents: number;
    time: number;
  }>;
  riskDistribution: Array<{
    risk: string;
    count: number;
    color: string;
  }>;
  monthlyTrends: {
    documentsGrowth: number;
    timeImprovement: number;
    accuracyChange: number;
  };
}
export const EnhancedInsights = ({
  userId
}: {
  userId: string;
}) => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Enhanced demo data with charts
  const demoData: InsightsData = {
    totalDocs: 156,
    analyzedDocs: 142,
    avgTime: 2.3,
    accuracy: 97.2,
    weeklyData: [{
      day: "Mon",
      documents: 12,
      time: 2.1
    }, {
      day: "Tue",
      documents: 18,
      time: 2.3
    }, {
      day: "Wed",
      documents: 15,
      time: 2.0
    }, {
      day: "Thu",
      documents: 22,
      time: 2.4
    }, {
      day: "Fri",
      documents: 19,
      time: 2.2
    }, {
      day: "Sat",
      documents: 8,
      time: 2.0
    }, {
      day: "Sun",
      documents: 5,
      time: 1.9
    }],
    riskDistribution: [{
      risk: "Low Risk",
      count: 89,
      color: "#22c55e"
    }, {
      risk: "Medium Risk",
      count: 43,
      color: "#f59e0b"
    }, {
      risk: "High Risk",
      count: 18,
      color: "#ef4444"
    }, {
      risk: "Critical",
      count: 6,
      color: "#dc2626"
    }],
    monthlyTrends: {
      documentsGrowth: 23.5,
      timeImprovement: -15.2,
      accuracyChange: 2.1
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setInsights(demoData);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [userId]);
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => <Card key={i} className="p-6 animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </Card>)}
      </div>;
  }
  if (!insights) return null;
  const completionRate = insights.analyzedDocs / insights.totalDocs * 100;
  return <div className="space-y-8">
      {/* Main Stats Cards */}
      

      {/* Charts Section */}
      

      {/* Performance Metrics */}
      
    </div>;
};