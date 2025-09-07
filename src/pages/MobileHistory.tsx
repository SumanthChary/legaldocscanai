import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Calendar, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useAnalyses } from "@/components/document-analysis/hooks/useAnalyses";

export default function MobileHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { analyses, isRefreshing } = useAnalyses();

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <MobileLayout>
      <MobileHeader title="Scan History" />
      
      <div className="px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{analyses.length}</div>
            <div className="text-sm text-muted-foreground">Total Scans</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {analyses.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {isRefreshing ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No documents yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by scanning your first document
              </p>
              <Button onClick={() => navigate("/scan")}>
                Scan Document
              </Button>
            </Card>
          ) : (
            filteredAnalyses.map((analysis) => (
              <Card key={analysis.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{analysis.file_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(analysis.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(analysis.status)}
                        >
                          {analysis.status}
                        </Badge>
                        
                        {analysis.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/document-summary/${analysis.id}`)}
                            className="p-1 h-8 w-8"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
}