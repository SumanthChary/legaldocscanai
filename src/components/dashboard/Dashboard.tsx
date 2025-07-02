
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { WelcomeHeader } from "./WelcomeHeader";
import { QuickActions } from "./QuickActions";
import { AnalyticsCards } from "./AnalyticsCards";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
            <button 
              onClick={() => navigate("/auth")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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

          <AnalyticsCards stats={analysisStats} isLoading={statsLoading} />

          <MainContent 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            userId={session.user.id} 
          />
        </div>
      </div>
    </div>
  );
};
