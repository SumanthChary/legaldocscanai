
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  DocumentHeader, 
  DocumentInfo, 
  StatusDisplay, 
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DocumentHeader 
            refreshAnalysis={fetchAnalysis} 
            refreshing={refreshing}
            analysisStatus={analysis.analysis_status}
          />

          <Card className="p-6 mb-6">
            <DocumentInfo 
              originalName={analysis.original_name} 
              createdAt={analysis.created_at} 
            />
            
            <StatusDisplay analysisStatus={analysis.analysis_status} />

            <SummaryContent 
              analysisStatus={analysis.analysis_status} 
              summary={analysis.summary}
              originalName={analysis.original_name}
            />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentSummary;
