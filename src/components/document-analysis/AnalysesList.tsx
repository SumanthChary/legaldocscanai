import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisItem } from "./AnalysisItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const AnalysesList = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
    const channel = subscribeToAnalyses();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const handleRefresh = () => {
    fetchAnalyses();
  };

  const handleDocumentDeleted = (deletedId: string) => {
    setAnalyses(current => current.filter(analysis => analysis.id !== deletedId));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recent Analyses</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <AnalysisItem 
            key={analysis.id} 
            analysis={analysis} 
            onDeleted={handleDocumentDeleted}
          />
        ))}
        {analyses.length === 0 && (
          <p className="text-center text-gray-500">No documents analyzed yet</p>
        )}
      </div>
    </Card>
  );
};
