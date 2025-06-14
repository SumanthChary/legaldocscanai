
import { Card } from "@/components/ui/card";
import { AnalysisItem } from "./AnalysisItem";
import { AnalysesHeader } from "./AnalysesHeader";
import { EmptyState } from "./EmptyState";
import { useAnalyses } from "./hooks/useAnalyses";

export const AnalysesList = () => {
  const { analyses, isRefreshing, fetchAnalyses, handleDocumentDeleted } = useAnalyses();

  return (
    <Card className="p-6">
      <AnalysesHeader onRefresh={fetchAnalyses} isRefreshing={isRefreshing} />
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <AnalysisItem 
            key={analysis.id} 
            analysis={analysis} 
            onDeleted={handleDocumentDeleted}
            onRefresh={fetchAnalyses}
          />
        ))}
        {analyses.length === 0 && <EmptyState />}
      </div>
    </Card>
  );
};
