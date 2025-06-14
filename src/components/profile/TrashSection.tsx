
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AnalysisItem } from "@/components/document-analysis/AnalysisItem";
import { TrashHeader } from "./trash/TrashHeader";
import { TrashEmptyState } from "./trash/TrashEmptyState";
import { TrashLoading } from "./trash/TrashLoading";

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
    return <TrashLoading />;
  }

  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <TrashHeader
        documentCount={trashedDocuments.length}
        isRefreshing={isRefreshing}
        onRefresh={refreshTrash}
        onClearAll={clearAllTrash}
      />

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
        
        {trashedDocuments.length === 0 && <TrashEmptyState />}
      </div>
    </Card>
  );
};
