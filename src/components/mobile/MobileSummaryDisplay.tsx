import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Eye, 
  EyeOff, 
  Copy, 
  Share2, 
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface DocumentSummary {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  riskLevel: "low" | "medium" | "high";
  documentType: string;
  wordCount: number;
  confidence: number;
  processingTime: number;
  createdAt: string;
}

interface MobileSummaryDisplayProps {
  summary: DocumentSummary;
  isLoading?: boolean;
}

export function MobileSummaryDisplay({ summary, isLoading = false }: MobileSummaryDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary);
      toast.success("Summary copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy summary");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: summary.title,
          text: summary.summary,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle2 className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse mobile-skeleton">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const truncatedSummary = summary.summary.length > 200 && !showFullSummary 
    ? summary.summary.substring(0, 200) + "..." 
    : summary.summary;

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="p-4 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg text-foreground mb-2 leading-tight">
              {summary.title}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {summary.documentType}
              </Badge>
              <Badge className={`text-xs ${getRiskColor(summary.riskLevel)}`}>
                {getRiskIcon(summary.riskLevel)}
                <span className="ml-1 capitalize">{summary.riskLevel} Risk</span>
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="font-semibold text-foreground">{summary.wordCount}</div>
                <div className="text-muted-foreground">Words</div>
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="font-semibold text-foreground">{summary.confidence}%</div>
                <div className="text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center p-2 bg-white/50 rounded-lg">
                <div className="font-semibold text-foreground">{summary.processingTime}s</div>
                <div className="text-muted-foreground">Processed</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Content */}
      <Card className="p-4 border-0 bg-gradient-to-br from-background to-muted/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-foreground">AI Summary</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullSummary(!showFullSummary)}
          >
            {showFullSummary ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncatedSummary}
          </p>
          
          {summary.summary.length > 200 && !showFullSummary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullSummary(true)}
              className="text-primary hover:text-primary/80"
            >
              Read more
            </Button>
          )}
        </div>
      </Card>

      {/* Key Points */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <Card className="p-4 border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-foreground">Key Points</h3>
          </div>
          
          <div className="space-y-2">
            {summary.keyPoints.slice(0, isExpanded ? undefined : 3).map((point, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-foreground leading-relaxed">{point}</span>
              </div>
            ))}
            
            {summary.keyPoints.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-2 text-emerald-700 hover:text-emerald-600"
              >
                {isExpanded ? 'Show less' : `Show ${summary.keyPoints.length - 3} more points`}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={handleCopy}
          className="gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Processing Info */}
      <Card className="p-3 border-0 bg-muted/30">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Analyzed on {new Date(summary.createdAt).toLocaleDateString()} • 
            Powered by advanced AI technology
          </p>
        </div>
      </Card>
    </div>
  );
}