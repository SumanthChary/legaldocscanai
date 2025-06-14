
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisItem } from "@/components/document-analysis/AnalysisItem";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentAnalysis {
  id: string;
  original_name: string;
  created_at: string;
  updated_at: string;
  analysis_status: string;
  summary?: string;
  is_deleted?: boolean;
  user_id: string;
}

export const TrashSection = () => {
  const [trashedDocuments, setTrashedDocuments] = useState<DocumentAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchTrashedDocuments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_deleted', true)
        .order('updated_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching trashed documents",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching trashed documents:", error);
      } else {
        console.log("📄 Fetched trashed documents:", data?.length || 0);
        setTrashedDocuments(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch trashed documents:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshTrash = async () => {
    setIsRefreshing(true);
    await fetchTrashedDocuments();
  };

  const clearAllTrash = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { error } = await supabase
        .from('document_analyses')
        .delete()
        .eq('user_id', session.user.id)
        .eq('is_deleted', true);

      if (error) {
        throw error;
      }

      toast({
        title: "Trash cleared",
        description: "All trashed documents have been permanently deleted",
      });

      setTrashedDocuments([]);
    } catch (error: any) {
      console.error("Error clearing trash:", error);
      toast({
        title: "Error clearing trash",
        description: error.message || "Failed to clear trash",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTrashedDocuments();

    // Set up real-time subscription for trash updates
    const channel = supabase
      .channel('trash_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses'
        },
        (payload) => {
          console.log("Trash real-time update received:", payload);
          fetchTrashedDocuments();
        }
      )
      .subscribe((status) => {
        console.log("Trash subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDocumentAction = (documentId: string) => {
    setTrashedDocuments(current => current.filter(doc => doc.id !== documentId));
  };

  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
            <Skeleton className="h-5 sm:h-6 w-24 sm:w-32" />
          </div>
          <Skeleton className="h-8 sm:h-9 w-20 sm:w-24" />
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-3 sm:p-4">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <Skeleton className="h-5 w-5 sm:h-6 sm:w-6" />
                <div className="flex-1">
                  <Skeleton className="h-4 sm:h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-1/2 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center">
          <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg mr-2 sm:mr-3">
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold">Trash</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {trashedDocuments.length} document{trashedDocuments.length !== 1 ? 's' : ''} in trash
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshTrash}
            disabled={isRefreshing}
            className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Refresh</span>
          </Button>
          {trashedDocuments.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearAllTrash}
              className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm"
            >
              <Archive className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Clear All</span>
              <span className="xs:hidden">Clear</span>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {trashedDocuments.map((doc) => (
          <AnalysisItem 
            key={doc.id} 
            analysis={doc} 
            onDeleted={handleDocumentAction}
            showRestore={true}
            onPermanentDelete={handleDocumentAction}
            onRefresh={fetchTrashedDocuments}
          />
        ))}
        
        {trashedDocuments.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <Trash2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">Trash is empty</h3>
            <p className="text-xs sm:text-sm text-gray-500 px-4">
              Deleted documents will appear here and can be restored or permanently deleted.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
