
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { 
  DocumentHeader, 
  DocumentInfo, 
  StatusDisplay, 
  SummaryContent,
  DocumentNotFound,
  DocumentLoading,
  SummaryActions
} from "@/components/document-summary";
import { useDocumentAnalysis } from "@/hooks/document-summary/useDocumentAnalysis";

const DocumentSummary = () => {
  const { id } = useParams();
  const { analysis, loading, refreshing, fetchAnalysis } = useDocumentAnalysis(id || '');

  if (loading) {
    return <DocumentLoading />;
  }

  if (!analysis) {
    return <DocumentNotFound />;
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DocumentHeader 
            refreshAnalysis={fetchAnalysis} 
            refreshing={refreshing}
            analysisStatus={analysis.analysis_status}
          />

          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <DocumentInfo 
                originalName={analysis.original_name} 
                createdAt={analysis.created_at} 
              />
              <SummaryActions 
                refreshAnalysis={fetchAnalysis}
                refreshing={refreshing}
                analysisId={id || ''}
              />
            </div>
            
            <StatusDisplay analysisStatus={analysis.analysis_status} />

            <SummaryContent 
              analysisStatus={analysis.analysis_status} 
              summary={analysis.summary}
              originalName={analysis.original_name}
            />
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentSummary;
