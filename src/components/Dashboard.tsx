
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivitySummary } from "./dashboard/ActivitySummary";
import { ContentTabs } from "./dashboard/ContentTabs";
import { DonationDialog } from "./dashboard/DonationDialog";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("documents");
  const [analysisStats, setAnalysisStats] = useState({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      }
    });

    const fetchUserProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      }
    };

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
      const lastDonationPrompt = localStorage.getItem('lastDonationPrompt');
      const now = new Date().getTime();
      const showAfterDays = 7; // Show dialog every 7 days if feature is used

      if (hasAnalysesWithSummary && 
          (!lastDonationPrompt || (now - parseInt(lastDonationPrompt)) > (showAfterDays * 24 * 60 * 60 * 1000))) {
        setShowDonationDialog(true);
        localStorage.setItem('lastDonationPrompt', now.toString());
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
  }, [session?.user?.id]);

  if (!session) return null;

  const userName = userProfile?.full_name || session?.user?.email?.split('@')[0] || 'User';

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

      <DashboardHeader 
        userName={userName} 
        onTabChange={setActiveTab} 
      />

      <StatsCards stats={analysisStats} />

      <ActivitySummary />

      <ContentTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userId={session.user.id} 
      />
    </div>
  );
};
