
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Share, Clock, RefreshCw, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const DocumentSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalysis();
    
    // Set up real-time subscription for updates
    const channel = supabase
      .channel('document_analysis_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchAnalysis();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching analysis:", error);
        toast({
          title: "Error loading document",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setAnalysis(data);
    } catch (err) {
      console.error("Failed to fetch analysis:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshAnalysis = () => {
    setRefreshing(true);
    fetchAnalysis();
  };

  const getStatusDisplay = () => {
    if (!analysis) return null;

    switch (analysis.analysis_status) {
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-3 rounded-md mb-6">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <p>AI is currently analyzing your document. This may take a few minutes...</p>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-md mb-6">
            <AlertTriangle className="h-5 w-5" />
            <p>Analysis failed. Please try uploading your document again.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-10 w-48" />
            </div>
            <Card className="p-6">
              <Skeleton className="h-6 w-64 mb-4" />
              <Skeleton className="h-4 w-36 mb-8" />
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
              <p className="text-gray-600 mb-6">The document you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshAnalysis}
                disabled={refreshing || analysis.analysis_status === 'pending'}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied",
                    description: "Document link copied to clipboard",
                  });
                }}
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{analysis.original_name}</h1>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Uploaded {formatDate(analysis.created_at)}
                </div>
              </div>
            </div>
            
            {getStatusDisplay()}

            {analysis.analysis_status === 'completed' && analysis.summary && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-3">AI Summary</h2>
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 text-gray-700 whitespace-pre-line">
                    {analysis.summary}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentSummary;
