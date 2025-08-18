import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InView } from "@/components/ui/in-view";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const weeklyData = [
  { name: "Mon", analyses: 4 },
  { name: "Tue", analyses: 7 },
  { name: "Wed", analyses: 12 },
  { name: "Thu", analyses: 8 },
  { name: "Fri", analyses: 15 },
  { name: "Sat", analyses: 6 },
  { name: "Sun", analyses: 3 },
];

const riskData = [
  { name: "Low Risk", value: 65, color: "#22c55e" },
  { name: "Medium Risk", value: 25, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#ef4444" },
];

const performanceData = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 92 },
  { month: "Apr", score: 89 },
  { month: "May", score: 94 },
  { month: "Jun", score: 96 },
];

export const WeeklyTrendChart = memo(() => (
  <InView
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }}
    transition={{ duration: 0.5 }}
  >
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Analysis Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px' 
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="analyses" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  </InView>
));

export const RiskDistributionChart = memo(() => (
  <InView
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={riskData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {riskData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  </InView>
));

export const PerformanceChart = memo(() => (
  <InView
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px' 
            }} 
          />
          <Bar 
            dataKey="score" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </InView>
));

WeeklyTrendChart.displayName = "WeeklyTrendChart";
RiskDistributionChart.displayName = "RiskDistributionChart";
PerformanceChart.displayName = "PerformanceChart";