import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  PieChart,
  Activity,
  Shield
} from "lucide-react";

interface AnalyticsData {
  totalScans: number;
  completedScans: number;
  processingScans: number;
  successRate: number;
  avgProcessingTime: number;
}

interface MobileAnalyticsProps {
  data: AnalyticsData;
}

export function MobileAnalytics({ data }: MobileAnalyticsProps) {
  const metrics = [
    {
      title: "Total Documents",
      value: data.totalScans,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%"
    },
    {
      title: "Completed",
      value: data.completedScans,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: "+8%"
    },
    {
      title: "Success Rate",
      value: `${data.successRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+5%"
    },
    {
      title: "Processing",
      value: data.processingScans,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: "2 active"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4 border-0 bg-gradient-to-br from-background to-muted/20">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <Badge variant="secondary" className="text-xs">
                {metric.trend}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{metric.title}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="p-4 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Performance</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Last 7 days
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Speed</span>
              <span className="font-medium text-foreground">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy Rate</span>
              <span className="font-medium text-foreground">98%</span>
            </div>
            <Progress value={98} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg. Time</span>
              <span className="font-medium text-foreground">{data.avgProcessingTime}s</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Usage Insights */}
      <Card className="p-4 border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-foreground">Usage Insights</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm font-medium">Peak Hours</span>
            </div>
            <span className="text-sm text-muted-foreground">2PM - 4PM</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">Most Active Day</span>
            </div>
            <span className="text-sm text-muted-foreground">Tuesday</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm font-medium">Avg. Documents</span>
            </div>
            <span className="text-sm text-muted-foreground">8 per day</span>
          </div>
        </div>
      </Card>

      {/* Security Status */}
      <Card className="p-4 border-0 bg-gradient-to-br from-background to-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-foreground">Security Status</h3>
          <Badge className="ml-auto bg-green-100 text-green-800">Secure</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-foreground">256-bit</div>
            <div className="text-xs text-muted-foreground">Encryption</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-foreground">100%</div>
            <div className="text-xs text-muted-foreground">Compliance</div>
          </div>
        </div>
      </Card>
    </div>
  );
}