import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scan, FileText, BarChart3, Clock, TrendingUp, Shield, ArrowRight, Plus, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { supabase } from "@/integrations/supabase/client";
import { DocumentScanner } from "@/components/document-analysis/upload/DocumentScanner";

export default function MobileHome() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [user, setUser] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleScanComplete = (file: File) => {
    setShowScanner(false);
    // Navigate to scan page with the scanned file (this would need additional implementation)
    navigate("/scan");
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
      <MobileHeader title="LegalDoc Scanner" showAppName={false} />
      
      <div className="px-4 py-6 space-y-8 pb-24">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2 leading-tight">
                {user?.user_metadata?.full_name || user?.user_metadata?.name 
                  ? `Hello, ${(user.user_metadata.full_name || user.user_metadata.name).split(' ')[0]}` 
                  : user?.email 
                  ? `Hello, ${user.email.split('@')[0]}` 
                  : 'Hello'}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Ready to analyze your legal documents?
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Quick Action Card - Cal AI Inspired */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/95 to-primary p-8 shadow-xl shadow-primary/25">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Scan className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Document Scanner</h3>
                  <p className="text-white/80 text-sm">
                    Professional legal document analysis
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowScanner(true)}
              className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm h-14 text-base font-semibold rounded-2xl transition-all duration-200"
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-3" />
              New Scan
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
        </Card>

        {/* Stats Overview - Cal AI Style */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Progress</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/history")}
              className="text-primary hover:text-primary/80 font-medium"
            >
              View All →
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-sm p-3 sm:p-5 hover:shadow-lg transition-all duration-200">
                <div className="text-center space-y-2 sm:space-y-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary/5 rounded-full -translate-y-2 translate-x-2" />
              </Card>
            ))}
          </div>

          {/* Share Button */}
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              size="sm"
              className="px-6 h-10 rounded-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 font-medium"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'LegalDoc Scanner',
                    text: 'Check out this amazing legal document analysis app!',
                    url: window.location.origin,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share App
            </Button>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-foreground">Recent Documents</h2>
          
          <div className="space-y-3">
            {isRefreshing ? (
              [1, 2, 3].map((i) => (
                <Card key={i} className="p-5 animate-pulse border-0 bg-white/60 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-muted rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-muted rounded-lg w-3/4"></div>
                      <div className="h-3 bg-muted rounded-lg w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : analyses.length === 0 ? (
              <Card className="p-10 text-center border-0 bg-gradient-to-br from-muted/20 to-muted/5 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-foreground">Start Your First Analysis</h4>
                <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                  Upload a legal document to experience our advanced analysis capabilities
                </p>
                <Button 
                  onClick={() => navigate("/scan")} 
                  className="px-8 h-12 rounded-2xl font-semibold"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Upload Document
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
                    className="p-5 border-0 bg-white/60 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-white/80 active:scale-[0.98]"
                    onClick={() => navigate(`/document-summary/${analysis.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/25 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate text-foreground mb-2">
                          {analysis.file_name}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            {formatDate(analysis.created_at)}
                          </div>
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            analysis.status === 'completed' ? 'bg-emerald-500' : 
                            analysis.status === 'processing' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          <div className="text-sm font-medium text-muted-foreground capitalize">
                            {analysis.status}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {showScanner && (
        <DocumentScanner
          onScan={handleScanComplete}
          onClose={() => setShowScanner(false)}
        />
      )}
    </MobileLayout>
  );
}