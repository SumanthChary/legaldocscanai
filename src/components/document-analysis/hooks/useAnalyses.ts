
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchAnalyses = async () => {
    try {
      setIsRefreshing(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching analyses",
          description: error.message,
          variant: "destructive",
        });
        console.error("Error fetching analyses:", error);
      } else {
        setAnalyses(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch analyses:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const subscribeToAnalyses = () => {
    const channel = supabase
      .channel('document_analyses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses'
        },
        (payload) => {
          console.log("Received real-time update:", payload);
          fetchAnalyses();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return channel;
  };

  useEffect(() => {
    fetchAnalyses();
    const channel = subscribeToAnalyses();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDocumentDeleted = (deletedId: string) => {
    setAnalyses(current => current.filter(analysis => analysis.id !== deletedId));
  };

  return {
    analyses,
    isRefreshing,
    fetchAnalyses,
    handleDocumentDeleted
  };
};
