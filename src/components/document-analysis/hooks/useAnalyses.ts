
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchAnalyses = async () => {
    if (!user) {
      setAnalyses([]);
      return;
    }

    try {
      setIsRefreshing(true);

      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', user.id)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Error fetching analyses: " + error.message);
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
    if (!user) return null;
    
    const channel = supabase
      .channel('document_analyses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses',
          filter: `user_id=eq.${user.id}`
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
    if (user) {
      fetchAnalyses();
      const channel = subscribeToAnalyses();

      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  }, [user]);

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
