
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { 
  SummaryContent,
  DocumentNotFound,
  DocumentLoading
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <div className="max-w-5xl mx-auto">
            <SummaryContent 
              analysisStatus={analysis.analysis_status} 
              summary={analysis.summary}
              originalName={analysis.original_name}
              analysisId={id || ''}
              refreshAnalysis={fetchAnalysis}
              refreshing={refreshing}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentSummary;
