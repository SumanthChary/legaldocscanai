import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load heavy components for better performance
const DashboardOverview = lazy(() => import("./DashboardOverview"));
const DocumentGallery = lazy(() => import("@/components/DocumentGallery").then(m => ({ default: m.DocumentGallery })));
const DocumentAnalysis = lazy(() => import("@/components/DocumentAnalysis").then(m => ({ default: m.DocumentAnalysis })));
const EnhancedInsightsSection = lazy(() => import("./EnhancedInsightsSection").then(m => ({ default: m.EnhancedInsightsSection })));

export const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  
  type SessionType = { user?: { id: string } } | null;
  const [session, setSession] = useState<SessionType>(null);
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

  if (!session && isLoading) {
    return <DashboardSkeleton />;
  }

  if (!session && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="bg-card/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">Please sign in to access your legal dashboard.</p>
          <button
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            onClick={() => navigate('/auth')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "documents":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <DocumentGallery userId={session.user.id} />
          </Suspense>
        );
      case "upload":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <DocumentAnalysis />
          </Suspense>
        );
      case "insights":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <EnhancedInsightsSection userId={session.user.id} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardOverview 
              session={session} 
              onTabChange={(tab) => navigate(`/dashboard?tab=${tab}`)}
            />
          </Suspense>
        );
    }
  };

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-6">
          {renderActiveTab()}
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default EnhancedDashboard;