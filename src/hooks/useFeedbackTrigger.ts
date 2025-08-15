import { useState, useEffect } from 'react';

export const useFeedbackTrigger = (analysisId: string, isCompleted: boolean) => {
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!isCompleted || !analysisId) return;

    // Check if feedback was already shown for this analysis
    const feedbackShownKey = `feedback_shown_${analysisId}`;
    const alreadyShown = localStorage.getItem(feedbackShownKey);
    
    if (alreadyShown) return;

    // Show feedback randomly (40% chance)
    const shouldShow = Math.random() < 0.4;
    
    if (shouldShow) {
      // Delay showing feedback by 3 seconds
      const timer = setTimeout(() => {
        setShowFeedback(true);
        localStorage.setItem(feedbackShownKey, 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [analysisId, isCompleted]);

  const closeFeedback = () => {
    setShowFeedback(false);
  };

  return { showFeedback, closeFeedback };
};