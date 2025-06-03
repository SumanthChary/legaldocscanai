import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, ChevronDown, RefreshCw } from "lucide-react";
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
        toast({
          title: "Error fetching documents",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

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

    // Set up real-time subscription for document updates
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchDocuments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log("Profile update received:", payload);
          fetchProfile();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

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
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          Processing
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Failed
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Document Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents Used</span>
              <span className="font-medium">{userProfile.document_count} / {userProfile.document_limit}</span>
            </div>
            <Progress 
              value={(userProfile.document_count / userProfile.document_limit) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userProfile.document_count >= userProfile.document_limit 
                ? "You've reached your document limit. Consider upgrading your plan for more." 
                : `You can analyze ${userProfile.document_limit - userProfile.document_count} more document${userProfile.document_limit - userProfile.document_count !== 1 ? 's' : ''}.`
              }
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <InView key={doc.id}>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.original_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.created_at).toLocaleDateString()} 
                      {' • '}
                      {new Date(doc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    <div className="mt-2">
                      {getStatusBadge(doc.analysis_status)}
                    </div>
                  </div>
                </div>

                {doc.analysis_status === 'completed' && doc.summary && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50"
                      onClick={() => toggleSummary(doc.id)}
                    >
                      <span className="text-sm font-medium">
                        {expandedDocs.includes(doc.id) ? "Hide AI Summary" : "Show AI Summary"}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedDocs.includes(doc.id) ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    {expandedDocs.includes(doc.id) && (
                      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        {doc.summary}
                      </div>
                    )}
                  </div>
                )}

                {doc.analysis_status === 'pending' && (
                  <div className="text-sm text-yellow-600 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      <span>AI is analyzing your document...</span>
                    </div>
                  </div>
                )}

                {doc.analysis_status === 'failed' && (
                  <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span>Analysis failed. Please try uploading again.</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </InView>
        ))}
      </div>

      {documents.length === 0 && (
        <Card className="p-4 sm:p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Upload your first document to get started with the analysis
          </p>
        </Card>
      )}
    </div>
  );
};
