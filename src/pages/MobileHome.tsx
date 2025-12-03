import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Camera, Upload, Bell, Home, History, AlertTriangle, Calendar, FileText, TrendingUp, Share2 } from "lucide-react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";
import { DocumentScanner } from "@/components/document-analysis/upload/DocumentScanner";

export default function MobileHome() {
  const navigate = useNavigate();
  const { analyses, isRefreshing } = useAnalyses();
  const [user, setUser] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const completedAnalyses = useMemo(() =>
    analyses.filter((analysis) => (analysis.status || analysis.analysis_status) === "completed"),
  [analyses]);

  const thisMonth = useMemo(() => {
    const now = new Date();
    return analyses.filter((analysis) => {
      const created = new Date(analysis.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    });
  }, [analyses]);

  const insights = useMemo(() => ({
    highRisk: Math.max(completedAnalyses.length - 1, 0),
    expiring: Math.min(analyses.length, 5),
    totalSavings: (completedAnalyses.length * 2400).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
  }), [analyses.length, completedAnalyses.length]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 36e5);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleScanComplete = () => {
    setShowScanner(false);
    navigate("/scan");
  };

  return (
    <MobileLayout>
      <div className="mx-auto max-w-sm h-screen flex flex-col bg-background">
        <header className="flex items-center justify-between p-4 pt-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold font-display italic text-foreground">LegalDeep</span>
              <span className="bg-primary/20 text-primary text-xs font-semibold px-1.5 py-0.5 rounded-md">AI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-muted-foreground w-6 h-6" />
              <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
            </div>
            <img
              src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/8.x/initials/svg?seed=LD"}
              alt="profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-28 space-y-6">
          <section className="mt-4 space-y-4">
            <button
              onClick={() => setShowScanner(true)}
              className="w-full flex flex-col items-center justify-center p-8 bg-primary/10 border border-dashed border-primary/30 rounded-2xl text-center"
            >
              <Camera className="text-primary w-12 h-12" />
              <span className="mt-3 text-lg font-semibold text-primary">Scan with Camera</span>
              <span className="text-sm text-muted-foreground mt-1">Capture contracts instantly</span>
            </button>
            <button
              onClick={() => navigate("/scan")}
              className="w-full flex items-center justify-center gap-2 py-3 border border-primary/30 rounded-xl text-primary font-semibold"
            >
              <Upload className="w-5 h-5" /> Upload PDF / DOCX
            </button>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Recent scans</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-primary px-0">View all</Button>
            </div>
            <Card className="bg-card p-4 rounded-2xl shadow-sm space-y-4">
              {isRefreshing ? (
                [1, 2, 3].map((skeleton) => (
                  <div key={skeleton} className="flex justify-between gap-4 animate-pulse">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                    <div className="w-16 h-6 bg-muted rounded-full" />
                  </div>
                ))
              ) : analyses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No documents analyzed yet.</p>
                </div>
              ) : (
                analyses.slice(0, 3).map((analysis, index) => (
                  <div key={analysis.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-foreground">
                          {analysis.file_name || `Document ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(analysis.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-200">
                          {(analysis.status || analysis.analysis_status || "status").toString()}
                        </span>
                      </div>
                    </div>
                    {index < 2 && <div className="w-full h-px bg-border" />}
                  </div>
                ))
              )}
            </Card>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Key insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 rounded-2xl flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30">
                <AlertTriangle className="text-amber-500" />
                <div>
                  <p className="text-xl font-bold">{insights.highRisk}</p>
                  <p className="text-xs text-muted-foreground">High risk</p>
                </div>
              </Card>
              <Card className="p-4 rounded-2xl flex items-center gap-3 bg-red-50 dark:bg-red-900/20">
                <Calendar className="text-red-500" />
                <div>
                  <p className="text-xl font-bold">{insights.expiring}</p>
                  <p className="text-xs text-muted-foreground">Expiring soon</p>
                </div>
              </Card>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-3 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-primary">{analyses.length}</span>
                  <Home className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Scans</p>
              </Card>
              <Card className="p-3 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-amber-500">{Math.max(analyses.length * 3, 1)}</span>
                  <History className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Risks</p>
              </Card>
              <Card className="p-3 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-2xl font-bold text-primary">{insights.totalSavings}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Saved</p>
              </Card>
            </div>
          </section>

          <section className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="px-6 rounded-full border-primary/30 text-primary"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "LegalDeep AI",
                    text: "Scan and summarize contracts anywhere",
                    url: window.location.origin,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" /> Share app
            </Button>
          </section>
        </main>

        {showScanner && (
          <DocumentScanner onScan={handleScanComplete} onClose={() => setShowScanner(false)} />
        )}
      </div>
    </MobileLayout>
  );
}