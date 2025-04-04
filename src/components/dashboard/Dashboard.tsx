
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { AnalyticsCards } from "./AnalyticsCards";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { MainContent } from "./MainContent";
import { useAnalyticsStats } from "./useAnalyticsStats";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
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

  if (!session) return null;

  return (
    <PageLayout>
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <WelcomeHeader session={session} />
          <QuickActions onTabChange={setActiveTab} />
        </div>

        <AnalyticsCards stats={analysisStats} isLoading={statsLoading} />

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
    </PageLayout>
  );
};
