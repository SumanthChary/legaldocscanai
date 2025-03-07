
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
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const { analysisStats, showDonationDialog, setShowDonationDialog } = useAnalyticsStats(session?.user?.id);

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

      <AnalyticsCards stats={analysisStats} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <RecentActivity />
        <PerformanceMetrics />
      </div>

      <MainContent 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userId={session.user.id} 
      />
    </div>
  );
};
