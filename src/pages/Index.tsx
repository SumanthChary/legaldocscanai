
import { EnhancedDashboard } from "@/components/dashboard/EnhancedDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <ErrorBoundary>
      <EnhancedDashboard />
    </ErrorBoundary>
  );
};

export default Index;
