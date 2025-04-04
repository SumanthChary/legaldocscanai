
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

  // Show loading only on initial load
  if (!session && isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 h-48 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
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

        <AnalyticsCards stats={analysisStats} isLoading={false} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <RecentActivity isLoading={false} />
          <PerformanceMetrics isLoading={false} />
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
