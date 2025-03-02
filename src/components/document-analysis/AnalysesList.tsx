
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisItem } from "./AnalysisItem";

export const AnalysesList = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // User not logged in, don't attempt to fetch analyses
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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Recent Analyses</h2>
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <AnalysisItem key={analysis.id} analysis={analysis} />
        ))}
        {analyses.length === 0 && (
          <p className="text-center text-gray-500">No documents analyzed yet</p>
        )}
      </div>
    </Card>
  );
};
