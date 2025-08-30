import { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load heavy components for better performance
const DashboardOverview = lazy(() => import("./DashboardOverview"));
const DocumentGallery = lazy(() => import("@/components/DocumentGallery").then(m => ({ default: m.DocumentGallery })));
const UploadSection = lazy(() => import("./UploadSection").then(m => ({ default: m.UploadSection })));
const EnhancedInsightsSection = lazy(() => import("./EnhancedInsightsSection").then(m => ({ default: m.EnhancedInsightsSection })));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const ESignatures = lazy(() => import("@/pages/ESignatures"));
const TeamManagement = lazy(() => import("../enterprise/TeamManagement").then(m => ({ default: m.TeamManagement })));
const OrganizationSettings = lazy(() => import("../enterprise/OrganizationSettings").then(m => ({ default: m.OrganizationSettings })));
const SecurityManagement = lazy(() => import("../enterprise/SecurityManagement").then(m => ({ default: m.SecurityManagement })));
const ApiDashboard = lazy(() => import("@/pages/ApiDashboard"));

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
            <UploadSection onSuccess={() => navigate('/dashboard?tab=documents')} />
          </Suspense>
        );
      case "chat":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <ChatPage />
          </Suspense>
        );
      case "esignatures":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <ESignatures />
          </Suspense>
        );
      case "insights":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <EnhancedInsightsSection userId={session.user.id} />
          </Suspense>
        );
      case "team":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <TeamManagement />
          </Suspense>
        );
      case "organization":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <OrganizationSettings />
          </Suspense>
        );
      case "security":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <SecurityManagement />
          </Suspense>
        );
      case "api":
        return (
          <Suspense fallback={<DashboardSkeleton />}>
            <ApiDashboard />
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