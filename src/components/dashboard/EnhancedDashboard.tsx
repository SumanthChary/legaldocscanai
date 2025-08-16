import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { EnhancedInsights } from "./EnhancedInsights";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { EnhancedMainContent } from "./EnhancedMainContent";
import { useAnalyticsStats } from "./useAnalyticsStats";
import { UpgradeBanner } from "@/components/ui/upgrade-banner";
import { DashboardSkeleton } from "./DashboardSkeleton";

export const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  type SessionType = { user?: { id: string; email?: string; user_metadata?: any } } | null;
  const [session, setSession] = useState<SessionType>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("upload"); // Default to upload as requested
  const [isLoading, setIsLoading] = useState(true);
  
  const getSession = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        setProfile(profileData);
        
        // Check if should show upgrade banner
        if (profileData?.document_count >= 5) {
          setShowUpgradeBanner(true);
        }
      }
    } catch (error) {
      console.error("Error getting session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSession();
  }, [getSession]);

  useEffect(() => {
    // Handle tab from URL params
    const tab = searchParams.get('tab');
    if (tab && ['upload', 'documents', 'insights'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const { analysisStats, isLoading: statsLoading } = useAnalyticsStats(session?.user?.id);

  if (!session && isLoading) {
    return <DashboardSkeleton />;
  }

  if (!session && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="bg-white/90 p-8 rounded-xl shadow-lg border text-center max-w-md">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">L</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Your Legal AI Dashboard</h2>
          <p className="mb-6 text-muted-foreground">Sign in to manage your documents, AI analysis, and legal workflows.</p>
          <button
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
            onClick={() => navigate('/auth')}
          >
            Sign In to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8 relative">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-purple-600/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/5 to-pink-500/5 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10">
            {showUpgradeBanner && (
              <div className="mb-6">
                <UpgradeBanner
                  buttonText="Upgrade to Pro"
                  description="Unlock unlimited document analysis and advanced AI features"
                  onClose={() => setShowUpgradeBanner(false)}
                  onClick={() => navigate("/pricing")}
                />
              </div>
            )}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
              <WelcomeHeader session={session} />
              <QuickActions onTabChange={handleTabChange} />
            </div>

            <EnhancedInsights userId={session?.user?.id || ""} />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              <RecentActivity isLoading={statsLoading} />
              <PerformanceMetrics isLoading={statsLoading} />
            </div>

            <EnhancedMainContent 
              activeTab={activeTab} 
              setActiveTab={handleTabChange} 
              userId={session.user.id} 
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};