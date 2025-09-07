import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan, FileText, BarChart3, Clock, TrendingUp, Sparkles } from "lucide-react";
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
    { label: "Total Scans", value: analyses.length.toString(), icon: FileText, color: "text-blue-500" },
    { label: "This Month", value: thisMonth.length.toString(), icon: TrendingUp, color: "text-green-500" },
    { label: "Completed", value: completedAnalyses.length.toString(), icon: Clock, color: "text-orange-500" },
  ];

  return (
    <MobileLayout>
      <MobileHeader title="LegalDeep Scanner" />
      
      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h2>
          <p className="text-muted-foreground">Ready to analyze your legal documents?</p>
        </div>

        {/* Quick Scan Button */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mobile-tap">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Document Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Advanced legal document analysis in seconds
              </p>
            </div>
            <Button 
              onClick={() => navigate("/scan")}
              className="w-full h-12 text-lg gap-2 mobile-tap"
              size="lg"
            >
              <Scan className="w-5 h-5" />
              Start Scanning
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Recent Scans */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Scans</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/history")}
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
              <Card className="p-6 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h4 className="font-medium mb-2">No scans yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by scanning your first document
                </p>
                <Button onClick={() => navigate("/scan")} size="sm">
                  Scan Document
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
                  <Card key={analysis.id} className="p-4 mobile-tap">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{analysis.file_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(analysis.created_at)}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/document-summary/${analysis.id}`)}
                        className="mobile-tap"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
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