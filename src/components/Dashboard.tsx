import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, Search, Clock, TrendingUp, Users, Target, Zap, BarChart, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentGallery } from "@/components/DocumentGallery";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [hasShownDonation, setHasShownDonation] = useState(false);
  const [analysisStats, setAnalysisStats] = useState({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
        <h1 className="text-3xl font-bold text-primary mb-4 md:mb-0">Document Analysis Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

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

      <Tabs defaultValue="documents" className="space-y-4">
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
