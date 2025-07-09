
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, FileText, Clock, BarChart } from "lucide-react";

type InsightsData = {
  totalDocs: number;
  analyzedDocs: number;
  avgTime: number;
  accuracy: number;
};

export const InsightsSection = ({ userId }: { userId: string }) => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/insights?userId=${userId}`)
      .then(res => res.json())
      .then((data: InsightsData) => {
        setInsights(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <Card className="p-6">Loading insights...</Card>;
  if (!insights) return <Card className="p-6">No insights available.</Card>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 flex flex-col items-start">
        <FileText className="h-8 w-8 text-accent mb-2" />
        <div className="text-2xl font-bold">{insights.totalDocs}</div>
        <div className="text-gray-500">Total Documents</div>
      </Card>
      <Card className="p-6 flex flex-col items-start">
        <TrendingUp className="h-8 w-8 text-success mb-2" />
        <div className="text-2xl font-bold">{insights.analyzedDocs}</div>
        <div className="text-gray-500">Analyzed</div>
      </Card>
      <Card className="p-6 flex flex-col items-start">
        <Clock className="h-8 w-8 text-warning mb-2" />
        <div className="text-2xl font-bold">{insights.avgTime?.toFixed(2) ?? "--"}s</div>
        <div className="text-gray-500">Avg. Analysis Time</div>
      </Card>
      <Card className="p-6 flex flex-col items-start">
        <BarChart className="h-8 w-8 text-info mb-2" />
        <div className="text-2xl font-bold">{insights.accuracy ?? "--"}%</div>
        <div className="text-gray-500">AI Accuracy</div>
      </Card>
    </div>
  );
};
