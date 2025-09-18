import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentAnalysis } from "@/hooks/document-summary/useDocumentAnalysis";
import { SummaryContent } from "@/components/document-summary/SummaryContent";
import { FileText, Clock, AlertCircle, CheckCircle2, Loader2, Download, Share, MoreVertical } from "lucide-react";
export default function MobileDocumentSummary() {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    analysis,
    loading,
    refreshing,
    fetchAnalysis
  } = useDocumentAnalysis(id!);
  if (loading) {
    return <MobileLayout>
        <MobileHeader title="Document Analysis" showBack />
        <div className="px-4 py-6 space-y-4">
          {[1, 2, 3].map(i => <Card key={i} className="p-6 animate-pulse mobile-skeleton">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </Card>)}
        </div>
      </MobileLayout>;
  }
  if (!analysis) {
    return <MobileLayout>
        <MobileHeader title="Document Not Found" showBack />
        <div className="px-4 py-6">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Document not found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The document you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate("/history")}>
              Back to History
            </Button>
          </Card>
        </div>
      </MobileLayout>;
  }
  const getStatusIcon = () => {
    const status = analysis.status || analysis.analysis_status;
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };
  const getStatusColor = () => {
    const status = analysis.status || analysis.analysis_status;
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  return <MobileLayout>
      <MobileHeader title="Analysis Results" showBack />
      
      <div className="px-4 py-4 space-y-4">
        {/* Document Info Card */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">{analysis.file_name || analysis.original_name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(analysis.created_at)}
                  </p>
                </div>
                
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                {getStatusIcon()}
                <Badge variant="secondary" className={getStatusColor()}>
                  {analysis.status || analysis.analysis_status}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Processing Status */}
        {(analysis.status === 'processing' || analysis.analysis_status === 'processing') && <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing Document</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                AI is analyzing your document. This usually takes 30-60 seconds.
              </p>
            </div>
          </Card>}

        {/* Quick Actions */}
        {(analysis.status === 'completed' || analysis.analysis_status === 'completed') && <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <Share className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>}

        {/* Summary Content */}
        <div className="space-y-4">
          <SummaryContent analysisStatus={analysis.status || analysis.analysis_status} summary={analysis.summary} originalName={analysis.file_name || analysis.original_name} analysisId={analysis.id} refreshAnalysis={fetchAnalysis} refreshing={refreshing} />
        </div>

        {/* Error State */}
        {(analysis.status === 'failed' || analysis.analysis_status === 'failed') && <Card className="p-4 border-destructive/20 bg-destructive/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-destructive">Analysis Failed</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  There was an error processing your document. Please try uploading it again.
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate("/scan")} className="mt-3">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>}

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20"></div>
      </div>
    </MobileLayout>;
}