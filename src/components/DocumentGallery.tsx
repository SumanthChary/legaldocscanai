
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentGalleryProps {
  userId: string;
}

export const DocumentGallery = ({ userId }: DocumentGalleryProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [expandedDocs, setExpandedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const { data: docs, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', userId)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Fetch documents error:", error);
        toast({
          title: "Error fetching documents",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("📄 Fetched documents:", docs?.length || 0);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Fetch profile error:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchDocuments(), fetchProfile()]);
  };

  useEffect(() => {
    fetchDocuments();
    fetchProfile();

    // Set up real-time subscription with more specific filtering
    const channel = supabase
      .channel(`document_updates_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("🔄 Real-time document update:", payload);
          // Immediate refresh when status changes
          fetchDocuments();
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    // Auto-refresh every 5 seconds for pending documents
    const interval = setInterval(() => {
      const hasPendingDocs = documents.some(doc => doc.analysis_status === 'pending');
      if (hasPendingDocs) {
        console.log("🔄 Auto-refreshing for pending documents");
        fetchDocuments();
      }
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [userId, documents]);

  const toggleSummary = (docId: string) => {
    setExpandedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          ✅ Completed
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Processing...
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          ❌ Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
          {status}
        </span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-4 sm:p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {userProfile && (
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Document Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Documents Used</span>
              <span className="font-bold text-blue-600">{userProfile.document_count} / {userProfile.document_limit}</span>
            </div>
            <Progress 
              value={(userProfile.document_count / userProfile.document_limit) * 100} 
              className="h-3"
            />
            <p className="text-xs text-gray-600 mt-2">
              {userProfile.document_count >= userProfile.document_limit 
                ? "You've reached your document limit. Consider upgrading your plan for more." 
                : `You can analyze ${userProfile.document_limit - userProfile.document_count} more document${userProfile.document_limit - userProfile.document_count !== 1 ? 's' : ''}.`
              }
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <InView key={doc.id}>
            <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl shrink-0">
                    <FileText className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {doc.original_name}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(doc.created_at).toLocaleDateString()} 
                      {' • '}
                      {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <div className="mb-3">
                      {getStatusBadge(doc.analysis_status)}
                    </div>
                  </div>
                </div>

                {doc.analysis_status === 'completed' && doc.summary && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-left flex justify-between items-center p-3 hover:bg-gray-50 border border-gray-200 rounded-lg"
                        onClick={() => toggleSummary(doc.id)}
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {expandedDocs.includes(doc.id) ? "Hide Preview" : "Show Preview"}
                        </span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform ${
                            expandedDocs.includes(doc.id) ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 px-3 border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => window.open(`/document-summary/${doc.id}`, '_blank')}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-xs font-medium">Full Analysis</span>
                      </Button>
                    </div>
                    {expandedDocs.includes(doc.id) && (
                      <div className="text-sm text-gray-700 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 leading-relaxed">
                        <div className="whitespace-pre-wrap">{doc.summary}</div>
                      </div>
                    )}
                  </div>
                )}

                {doc.analysis_status === 'pending' && (
                  <div className="text-sm text-blue-700 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span className="font-medium">AI is analyzing your document...</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">This may take a few moments</p>
                  </div>
                )}

                {doc.analysis_status === 'failed' && (
                  <div className="text-sm text-red-700 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Analysis failed. Please try uploading again.</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </InView>
        ))}
      </div>

      {documents.length === 0 && (
        <Card className="p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
          <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No documents found</h3>
          <p className="text-sm text-gray-600">
            Upload your first document to get started with AI analysis
          </p>
        </Card>
      )}
    </div>
  );
};
