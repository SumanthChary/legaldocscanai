
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate } from "react-router-dom";
import { DonationDialog } from "./DonationDialog";
import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { AnalyticsCards } from "./AnalyticsCards";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { MainContent } from "./MainContent";
import { useAnalyticsStats } from "./useAnalyticsStats";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSession();
  }, []);

  const { analysisStats, isLoading: statsLoading, showDonationDialog, setShowDonationDialog } = useAnalyticsStats(session?.user?.id);

  if (!session && isLoading) {
    return (
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
    );
  }

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

      <DonationDialog 
        open={showDonationDialog} 
        onOpenChange={setShowDonationDialog} 
      />

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
  );
};
