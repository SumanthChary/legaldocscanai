import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <MobileLayout showNavigation={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-muted rounded mx-auto animate-pulse" />
              <div className="w-32 h-3 bg-muted/70 rounded mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}