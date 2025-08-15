import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";

interface Feedback {
  id: string;
  rating: number;
  feedback_text: string;
  created_at: string;
  analysis_id: string;
}

const FeedbackDashboard = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFeedbacks(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Feedback[]) => {
    const totalFeedbacks = data.length;
    const totalRating = data.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
    
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(feedback => {
      ratingBreakdown[feedback.rating as keyof typeof ratingBreakdown]++;
    });

    setStats({ totalFeedbacks, averageRating, ratingBreakdown });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}
      />
    ));
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading feedback...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Feedback Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor user satisfaction and feedback for LegalDeep AI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageRating.toFixed(1)}/5
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalFeedbacks > 0 
                  ? Math.round(((stats.ratingBreakdown[4] + stats.ratingBreakdown[5]) / stats.totalFeedbacks) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                4-5 star ratings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((stats.totalFeedbacks / Math.max(1, stats.totalFeedbacks)) * 40)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Est. based on 40% trigger rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rating Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-12">
                    <span>{rating}</span>
                    <Star size={14} className="text-yellow-500" />
                  </div>
                  <div className="flex-1 bg-secondary h-2 rounded">
                    <div 
                      className="bg-primary h-2 rounded"
                      style={{ 
                        width: stats.totalFeedbacks > 0 
                          ? `${(stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown] / stats.totalFeedbacks) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No feedback received yet
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {renderStars(feedback.rating)}
                        <Badge variant="outline">
                          {feedback.rating}/5
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(feedback.created_at), 'MMM d, yyyy - HH:mm')}
                      </span>
                    </div>
                    {feedback.feedback_text && (
                      <p className="text-sm text-muted-foreground mt-2">
                        "{feedback.feedback_text}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Analysis ID: {feedback.analysis_id?.slice(0, 8)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default FeedbackDashboard;