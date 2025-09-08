import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan, FileText, BarChart3, Clock, TrendingUp, Shield, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { supabase } from "@/integrations/supabase/client";

export default function MobileHome() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const thisMonth = analyses.filter(a => {
    const created = new Date(a.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  });

  const stats = [
    { 
      label: "Documents", 
      value: analyses.length.toString(), 
      icon: FileText, 
      gradient: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
      trend: analyses.length > 0 ? "+12%" : "0%"
    },
    { 
      label: "This Month", 
      value: thisMonth.length.toString(), 
      icon: TrendingUp, 
      gradient: "from-emerald-500/10 to-emerald-600/10",
      iconColor: "text-emerald-600",
      trend: thisMonth.length > 0 ? "+23%" : "0%"
    },
    { 
      label: "Completed", 
      value: completedAnalyses.length.toString(), 
      icon: Shield, 
      gradient: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
      trend: completedAnalyses.length > 0 ? "+8%" : "0%"
    },
  ];

  return (
    <MobileLayout>
      <MobileHeader title="LegalDeep" />
      
      <div className="px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user?.email ? `Hello, ${user.email.split('@')[0]}` : 'Welcome'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Professional document analysis at your fingertips
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-primary/90 p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <Button 
                onClick={() => navigate("/scan")}
                size="sm"
                variant="secondary"
                className="bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">Document Analysis</h3>
            <p className="text-white/80 text-sm mb-4">
              Upload and analyze legal documents instantly
            </p>
            <Button 
              onClick={() => navigate("/scan")}
              className="w-full bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-sm h-11"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Analysis
            </Button>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        </Card>

        {/* Analytics Overview */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <Card key={index} className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} p-4`}>
                <div className="text-center space-y-2">
                  <div className={`w-8 h-8 mx-auto rounded-lg bg-white/50 flex items-center justify-center backdrop-blur-sm`}>
                    <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="text-xs font-medium text-emerald-600 mt-1">{stat.trend}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/history")}
              className="text-primary hover:text-primary/80"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-2">
            {isRefreshing ? (
              [1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse mobile-skeleton">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : analyses.length === 0 ? (
              <Card className="p-8 text-center border-0 bg-gradient-to-br from-muted/30 to-muted/10">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold mb-2 text-foreground">No documents yet</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Upload your first legal document to get started with professional analysis
                </p>
                <Button 
                  onClick={() => navigate("/scan")} 
                  className="px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
              </Card>
            ) : (
              analyses.slice(0, 3).map((analysis) => {
                const formatDate = (dateString: string) => {
                  const date = new Date(dateString);
                  const now = new Date();
                  const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
                  
                  if (diffHours < 1) return "Just now";
                  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
                  const diffDays = Math.floor(diffHours / 24);
                  if (diffDays === 1) return "1 day ago";
                  if (diffDays < 7) return `${diffDays} days ago`;
                  return date.toLocaleDateString();
                };

                return (
                  <Card 
                    key={analysis.id} 
                    className="p-4 border-0 bg-gradient-to-r from-background to-muted/20 mobile-tap cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => navigate(`/document-summary/${analysis.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate text-foreground mb-1">
                          {analysis.file_name}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(analysis.created_at)}
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            analysis.status === 'completed' ? 'bg-emerald-500' : 
                            analysis.status === 'processing' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}