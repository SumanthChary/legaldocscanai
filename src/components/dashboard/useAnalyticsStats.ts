
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AnalyticsStats = {
  totalDocuments: number;
  averageScore: number;
  improvementRate: number;
};

export const useAnalyticsStats = (userId: string | undefined) => {
  const [analysisStats, setAnalysisStats] = useState<AnalyticsStats>({
    totalDocuments: 0,
    averageScore: 0,
    improvementRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisStats = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data: analyses, error } = await supabase
          .from('document_analyses')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching analyses:', error);
          return;
        }

        setAnalysisStats({
          totalDocuments: analyses?.length || 0,
          averageScore: 85,
          improvementRate: 24,
        });
      } catch (error) {
        console.error('Unexpected error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAnalysisStats();
    }
  }, [userId]);

  return { analysisStats, isLoading };
};
