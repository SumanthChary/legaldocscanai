import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Search, Clock, TrendingUp, Users, Target, Zap, BarChart, Heart, HelpCircle, Book, Activity, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentGallery } from "@/components/DocumentGallery";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [hasShownDonation, setHasShownDonation] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [analysisStats, setAnalysisStats] = useState({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    });

    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      }
    };

    const fetchAnalysisStats = async () => {
      if (!session?.user?.id) return;

      const { data: analyses, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      const hasAnalysesWithSummary = analyses?.some(analysis => analysis.summary);
      if (hasAnalysesWithSummary && !hasShownDonation) {
        setShowDonationDialog(true);
        setHasShownDonation(true);
      }

      setAnalysisStats({
        totalDocuments: analyses?.length || 0,
        averageScore: 85,
        improvementRate: 24,
      });
    };

    if (session?.user?.id) {
      fetchAnalysisStats();
    }
  }, [session?.user?.id, hasShownDonation]);

  const quickActions = [
    {
      title: "New Analysis",
      icon: FileText,
      action: () => navigate("/document-analysis"),
      color: "text-blue-500"
    },
    {
      title: "View Documents",
      icon: Book,
      action: () => setActiveTab("documents"),
      color: "text-green-500"
    },
    {
      title: "Documentation",
      icon: HelpCircle,
      action: () => window.open("https://docs.legalbriefai.com", "_blank"),
      color: "text-purple-500"
    }
  ];

  const recentActivities = [
    {
      title: "Document Analysis Completed",
      time: "2 hours ago",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "New Feature Available",
      time: "1 day ago",
      icon: Bell,
      color: "text-blue-500"
    }
  ];

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {showUpgradeBanner && (
        <div className="mb-8">
          <UpgradeBanner
            buttonText="Upgrade Now"
            description="for unlimited document analysis"
            onClose={() => setShowUpgradeBanner(false)}
            onClick={() => navigate("/pricing")}
          />
        </div>
      )}

      <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent animate-pulse" />
              Support LegalBriefAI
            </DialogTitle>
            <DialogDescription>
              We need <a 
                href="https://www.figma.com/proto/eWAJORd1BV6OLT8V8a7CeE/LegalBriefAI?node-id=1-2&p=f&t=lxhZSOMTKwa7ZmrQ-1&scaling=scale-down-width&content-scaling=fixed&page-id=0%3A1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-accent hover:underline"
              >
                DONATIONS
              </a> for Multiple IMPROVEMENTS. IF ANY ONE EVEN DONATE $5/$10 WE WILL GIVE HIM LIFE TIME ACCESS TO OUR FEATURES
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, {userProfile?.full_name || session.user.email}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your documents today.
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2"
              onClick={action.action}
            >
              <action.icon className={`h-4 w-4 ${action.color}`} />
              {action.title}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Analysis Speed</span>
                <span className="text-green-500">+12%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Accuracy Rate</span>
                <span className="text-blue-500">99%</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card key={0} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">{analysisStats.totalDocuments.toString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Documents Analyzed</h3>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-4 w-4 mr-1 text-success" />
            <span className="text-success">+12% from last month</span>
          </div>
        </Card>

        <Card key={1} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <BarChart className="h-8 w-8 text-success" />
            <span className="text-2xl font-bold">${analysisStats.averageScore}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Analysis Score</h3>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-4 w-4 mr-1 text-success" />
            <span className="text-success">+5% improvement</span>
          </div>
        </Card>

        <Card key={2} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-warning" />
            <span className="text-2xl font-bold">2.5s</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Processing Time</h3>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-4 w-4 mr-1 text-warning" />
            <span className="text-warning">-30% faster</span>
          </div>
        </Card>

        <Card key={3} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">99%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accuracy Rate</h3>
          <div className="flex items-center text-xs">
            <TrendingUp className="h-4 w-4 mr-1 text-success" />
            <span className="text-success">Consistent</span>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <DocumentGallery userId={session.user.id} />
        </TabsContent>

        <TabsContent value="upload">
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
