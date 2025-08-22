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
    <Card className="p-3 sm:p-4 md:p-6 h-full">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 truncate">Weekly Analysis Trend</h3>
      <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
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
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </InView>
));

export const RiskDistributionChart = memo(() => {
  const [windowWidth, setWindowWidth] = useState(768);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth < 768;
  
  return (
    <InView
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-3 sm:p-4 md:p-6 h-full">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 truncate">Risk Distribution</h3>
        <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 30 : 40}
                outerRadius={isMobile ? 60 : isTablet ? 70 : 80}
                dataKey="value"
                label={!isMobile ? ({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%` : false}
                labelLine={false}
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
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend for mobile */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 sm:hidden">
          {riskData.map((entry, index) => (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium">{entry.name}: {entry.value}%</span>
            </div>
          ))}
        </div>
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
    <Card className="p-3 sm:p-4 md:p-6 h-full">
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 truncate">Performance Trend</h3>
      <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
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
      </div>
    </Card>
  </InView>
));

WeeklyTrendChart.displayName = "WeeklyTrendChart";
RiskDistributionChart.displayName = "RiskDistributionChart";
PerformanceChart.displayName = "PerformanceChart";