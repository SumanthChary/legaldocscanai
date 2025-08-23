import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DocumentMetrics } from "../hooks/useDocumentMetrics";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";
import { FileText, Clock, AlertTriangle, BookOpen, TrendingUp, Shield } from "lucide-react";

interface DocumentMetricsChartsProps {
  metrics: DocumentMetrics;
  fileName: string;
}

const COLORS = {
  low: '#10b981',
  medium: '#f59e0b', 
  high: '#ef4444',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4'
};

export const DocumentMetricsCharts = ({ metrics, fileName }: DocumentMetricsChartsProps) => {
  const riskData = [
    { name: 'Low Risk', value: metrics.riskLevel === 'low' ? 100 : 0, fill: COLORS.low },
    { name: 'Medium Risk', value: metrics.riskLevel === 'medium' ? 100 : 0, fill: COLORS.medium },
    { name: 'High Risk', value: metrics.riskLevel === 'high' ? 100 : 0, fill: COLORS.high }
  ];

  const complexityData = [
    { name: 'Complexity', value: metrics.complexityScore, fill: COLORS.primary }
  ];

  const overviewData = [
    { name: 'Word Count', value: Math.min(metrics.wordCount, 5000), max: 5000 },
    { name: 'Reading Time', value: Math.min(metrics.readingTime, 30), max: 30 },
    { name: 'Key Terms', value: Math.min(metrics.keyTermsCount, 50), max: 50 },
    { name: 'Clauses', value: Math.min(metrics.clausesCount, 20), max: 20 }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <FileText className="h-4 w-4" />;
      case 'legal': return <Shield className="h-4 w-4" />;
      case 'business': return <TrendingUp className="h-4 w-4" />;
      case 'technical': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Document Analytics</h2>
        <p className="text-sm text-gray-600">Real-time metrics and insights for {fileName}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Words</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.wordCount.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Read Time</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.readingTime}m</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`h-5 w-5 ${metrics.riskLevel === 'high' ? 'text-red-600' : metrics.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`} />
            <div>
              <p className="text-sm text-gray-600">Risk Level</p>
              <Badge variant={metrics.riskLevel === 'high' ? 'destructive' : metrics.riskLevel === 'medium' ? 'secondary' : 'default'}>
                {metrics.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            {getDocumentTypeIcon(metrics.documentType)}
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{metrics.documentType}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Assessment Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Risk Assessment
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={complexityData}>
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={COLORS[metrics.riskLevel]}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-900">
                  {metrics.riskScore}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-600">Risk Score: {metrics.riskScore}/100</p>
          </div>
        </Card>

        {/* Document Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Document Overview
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Complexity Score</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Complexity</span>
              <span className="text-sm font-semibold">{metrics.complexityScore}/100</span>
            </div>
            <Progress value={metrics.complexityScore} className="h-2" />
            <p className="text-xs text-gray-500">
              {metrics.complexityScore < 30 ? 'Simple document' : 
               metrics.complexityScore < 70 ? 'Moderate complexity' : 'High complexity'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Readability</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Readability</span>
              <span className="text-sm font-semibold">{Math.round(metrics.readabilityScore)}/100</span>
            </div>
            <Progress value={metrics.readabilityScore} className="h-2" />
            <p className="text-xs text-gray-500">
              {metrics.readabilityScore > 70 ? 'Easy to read' : 
               metrics.readabilityScore > 40 ? 'Moderate difficulty' : 'Difficult to read'}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sentiment</span>
              <span className="text-sm font-semibold">{Math.round(metrics.sentimentScore)}/100</span>
            </div>
            <Progress value={metrics.sentimentScore} className="h-2" />
            <p className="text-xs text-gray-500">
              {metrics.sentimentScore > 60 ? 'Positive tone' : 
               metrics.sentimentScore > 40 ? 'Neutral tone' : 'Concerning tone'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};