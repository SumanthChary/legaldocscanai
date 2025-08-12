
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { EnhancedInsights } from "./EnhancedInsights";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { MainContent } from "./MainContent";
import { useAnalyticsStats } from "./useAnalyticsStats";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const Dashboard = () => {
  const navigate = useNavigate();
  type SessionType = { user?: { id: string } } | null;
  const [session, setSession] = useState<SessionType>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [isLoading, setIsLoading] = useState(true);
  
  const getSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    } catch (error) {
      console.error("Error getting session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  const { analysisStats, isLoading: statsLoading } = useAnalyticsStats(session?.user?.id);


  if (!session && isLoading) {
    return <DashboardSkeleton />;
  }

  if (!session && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="bg-white/90 p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Please log in to access your dashboard</h2>
          <p className="mb-4 text-gray-600">You must be signed in to view your documents and analytics.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => navigate('/auth')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Enhanced background with professional gradients */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8 relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/8 to-pink-500/8 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10">
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
              <WelcomeHeader session={session} />
              <QuickActions onTabChange={setActiveTab} />
            </div>

            <EnhancedInsights userId={session?.user?.id || ""} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <RecentActivity isLoading={statsLoading} />
              <PerformanceMetrics isLoading={statsLoading} />
            </div>

            <MainContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userId={session.user.id} 
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
