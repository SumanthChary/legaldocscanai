
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDocumentAnalysis = (id: string) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchAnalysis = async () => {
    setRefreshing(true);
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

  return {
    analysis,
    loading,
    refreshing,
    fetchAnalysis
  };
};
