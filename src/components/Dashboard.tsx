import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Search, Clock, TrendingUp, Users, Target, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Dashboard = () => {
  const stats = [
    {
      title: "Documents Analyzed",
      value: "128",
      icon: FileText,
      color: "text-accent",
      trend: "+12% from last month",
      trendUp: true
    },
    {
      title: "Risks Identified",
      value: "24",
      icon: AlertTriangle,
      color: "text-warning",
      trend: "-8% from last month",
      trendUp: false
    },
    {
      title: "Searches Performed",
      value: "356",
      icon: Search,
      color: "text-success",
      trend: "+24% from last month",
      trendUp: true
    },
    {
      title: "Time Saved",
      value: "180h",
      icon: Clock,
      color: "text-primary",
      trend: "+15% from last month",
      trendUp: true
    },
  ];

  const recentActivity = [
    {
      type: 'document',
      title: 'Contract Review',
      time: '2 hours ago',
      status: 'Completed',
      icon: FileText,
      statusColor: 'text-success'
    },
    {
      type: 'risk',
      title: 'Compliance Alert',
      time: '4 hours ago',
      status: 'High Priority',
      icon: AlertTriangle,
      statusColor: 'text-warning'
    },
    {
      type: 'search',
      title: 'Legal Precedent Search',
      time: '6 hours ago',
      status: 'Completed',
      icon: Search,
      statusColor: 'text-success'
    }
  ];

  const insights = [
    {
      title: "Efficiency Gains",
      value: "45%",
      icon: TrendingUp,
      description: "Increase in document processing speed"
    },
    {
      title: "Team Collaboration",
      value: "28",
      icon: Users,
      description: "Active team members this month"
    },
    {
      title: "Accuracy Rate",
      value: "99.2%",
      icon: Target,
      description: "In document analysis"
    },
    {
      title: "Processing Power",
      value: "2.5x",
      icon: Zap,
      description: "Faster than manual review"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">Welcome to LegalAI</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <div className="flex items-center text-xs">
              <TrendingUp className={`h-4 w-4 mr-1 ${stat.trendUp ? 'text-success' : 'text-warning'}`} />
              <span className={stat.trendUp ? 'text-success' : 'text-warning'}>{stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="activity" className="mb-8">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <activity.icon className={`h-6 w-6 ${activity.type === 'risk' ? 'text-warning' : 'text-accent'}`} />
                    <div className="flex-grow">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                    <span className={`text-sm font-medium ${activity.statusColor}`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                  <FileText className="h-6 w-6 text-accent mx-auto mb-2" />
                  <span className="text-sm font-medium block text-center">New Document</span>
                </button>
                <button className="p-4 bg-warning/10 rounded-lg hover:bg-warning/20 transition-colors">
                  <AlertTriangle className="h-6 w-6 text-warning mx-auto mb-2" />
                  <span className="text-sm font-medium block text-center">Risk Analysis</span>
                </button>
                <button className="p-4 bg-success/10 rounded-lg hover:bg-success/20 transition-colors">
                  <Search className="h-6 w-6 text-success mx-auto mb-2" />
                  <span className="text-sm font-medium block text-center">Search</span>
                </button>
                <button className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <span className="text-sm font-medium block text-center">Time Tracking</span>
                </button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <insight.icon className="h-8 w-8 text-accent" />
                  <span className="text-2xl font-bold">{insight.value}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{insight.title}</h3>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};