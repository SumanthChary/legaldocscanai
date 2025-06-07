
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="max-w-5xl mx-auto">
            <DocumentHeader 
              refreshAnalysis={fetchAnalysis} 
              refreshing={refreshing}
              analysisStatus={analysis.analysis_status}
            />

            <Card className="p-3 sm:p-6 lg:p-8 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-xl sm:rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-4 sm:mb-6">
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
              
              <div className="mb-4 sm:mb-6">
                <StatusDisplay analysisStatus={analysis.analysis_status} />
              </div>

              <SummaryContent 
                analysisStatus={analysis.analysis_status} 
                summary={analysis.summary}
                originalName={analysis.original_name}
              />
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentSummary;
