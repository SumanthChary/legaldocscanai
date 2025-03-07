
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
  const [showDonationDialog, setShowDonationDialog] = useState(false);

  useEffect(() => {
    const fetchAnalysisStats = async () => {
      if (!userId) return;

      const { data: analyses, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching analyses:', error);
        return;
      }

      const hasAnalysesWithSummary = analyses?.some(analysis => analysis.summary);
      const lastDonationPrompt = localStorage.getItem('lastDonationPrompt');
      const now = new Date().getTime();
      const showAfterDays = 7; // Show dialog every 7 days if feature is used

      if (hasAnalysesWithSummary && 
          (!lastDonationPrompt || (now - parseInt(lastDonationPrompt)) > (showAfterDays * 24 * 60 * 60 * 1000))) {
        setShowDonationDialog(true);
        localStorage.setItem('lastDonationPrompt', now.toString());
      }

      setAnalysisStats({
        totalDocuments: analyses?.length || 0,
        averageScore: 85,
        improvementRate: 24,
      });
    };

    if (userId) {
      fetchAnalysisStats();
    }
  }, [userId]);

  return { analysisStats, showDonationDialog, setShowDonationDialog };
};
