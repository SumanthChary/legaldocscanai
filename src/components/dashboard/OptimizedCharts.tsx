import { memo, useState, useEffect } from "react";
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
    <Card className="p-3 sm:p-4 md:p-6">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4">Weekly Analysis Trend</h3>
      <ResponsiveContainer width="100%" height={150} minHeight={120}>
        <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            className="text-xs" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="analyses" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  </InView>
));

export const RiskDistributionChart = memo(() => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <InView
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-3 sm:p-4 md:p-6">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={150} minHeight={120}>
          <PieChart>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 50 : 60}
              dataKey="value"
              label={!isMobile ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
            >
              {riskData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </InView>
  );
});

export const PerformanceChart = memo(() => (
  <InView
    variants={{
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <Card className="p-3 sm:p-4 md:p-6">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-3 md:mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={150} minHeight={120}>
        <BarChart data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-xs" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="text-xs" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }} 
          />
          <Bar 
            dataKey="score" 
            fill="hsl(var(--primary))"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </InView>
));

WeeklyTrendChart.displayName = "WeeklyTrendChart";
RiskDistributionChart.displayName = "RiskDistributionChart";
PerformanceChart.displayName = "PerformanceChart";