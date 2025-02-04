import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Search, Clock, TrendingUp, Users, Target, Zap, BarChart, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Dashboard = () => {
  const [analysisStats, setAnalysisStats] = useState({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
    latestDocument: null
  });

  useEffect(() => {
    const fetchAnalysisStats = async () => {
      const { data: analyses, error } = await supabase
        .from('document_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      const latestDoc = analyses?.[0];

      setAnalysisStats({
        totalDocuments: analyses?.length || 0,
        averageScore: 85,
        improvementRate: 24,
        latestDocument: latestDoc
      });
    };

    fetchAnalysisStats();
  }, []);

  const stats = [
    {
      title: "Documents Analyzed",
      value: analysisStats.totalDocuments.toString(),
      icon: FileText,
      color: "text-accent",
      trend: "+12% from last month",
      trendUp: true
    },
    {
      title: "Analysis Score",
      value: `${analysisStats.averageScore}%`,
      icon: BarChart,
      color: "text-success",
      trend: "+5% improvement",
      trendUp: true
    },
    {
      title: "Processing Time",
      value: "2.5s",
      icon: Clock,
      color: "text-warning",
      trend: "-30% faster",
      trendUp: true
    },
    {
      title: "Accuracy Rate",
      value: "99%",
      icon: Target,
      color: "text-primary",
      trend: "Consistent",
      trendUp: true
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">Document Analysis Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {analysisStats.latestDocument && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Latest Document</h2>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`${supabase.storage.from('documents').getPublicUrl(analysisStats.latestDocument.document_path).data.publicUrl}`} />
              <AvatarFallback>
                <FileText className="h-10 w-10 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{analysisStats.latestDocument.original_name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(analysisStats.latestDocument.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  analysisStats.latestDocument.analysis_status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {analysisStats.latestDocument.analysis_status}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Performance</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Document Quality Score</span>
                <span className="font-medium">{analysisStats.averageScore}%</span>
              </div>
              <Progress value={analysisStats.averageScore} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Efficiency</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accuracy Rate</span>
                <span className="font-medium">99%</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-success mr-2" />
                <span className="text-sm">Improvement Rate</span>
              </div>
              <span className="font-medium text-success">+{analysisStats.improvementRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-warning mr-2" />
                <span className="text-sm">Avg. Processing Time</span>
              </div>
              <span className="font-medium">2.5s</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-accent mr-2" />
                <span className="text-sm">Success Rate</span>
              </div>
              <span className="font-medium">98%</span>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="analysis">Document Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis">
          <DocumentAnalysis />
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Processing Speed",
                value: "2.5x",
                icon: Zap,
                description: "Faster than manual review"
              },
              {
                title: "Quality Score",
                value: "92%",
                icon: Target,
                description: "Document quality rating"
              },
              {
                title: "Success Rate",
                value: "98%",
                icon: TrendingUp,
                description: "Analysis completion rate"
              },
              {
                title: "Time Saved",
                value: "75%",
                icon: Clock,
                description: "Compared to manual process"
              }
            ].map((insight, index) => (
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