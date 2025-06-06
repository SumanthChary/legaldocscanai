import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ExternalLink, Trash2, RefreshCw } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AnalysisItemProps = {
  analysis: {
    id: string;
    original_name: string;
    created_at: string;
    analysis_status: string;
    summary?: string;
    is_deleted?: boolean;
  };
  onDeleted: (id: string) => void;
  showRestore?: boolean;
  onPermanentDelete?: (id: string) => void;
  onRefresh?: () => void;
};

export const AnalysisItem = ({ 
  analysis, 
  onDeleted, 
  showRestore = false, 
  onPermanentDelete,
  onRefresh
}: AnalysisItemProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const viewSummary = () => {
    navigate(`/document/${analysis.id}/summary`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch latest data for this analysis
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', analysis.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Analysis refreshed",
        description: "Latest analysis data has been loaded",
      });
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error refreshing analysis:", error);
      toast({
        title: "Error refreshing analysis",
        description: error.message || "Failed to refresh analysis data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSoftDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('document_analyses')
        .update({ 
          is_deleted: true,
          updated_at: new Date().toISOString() 
        })
        .eq('id', analysis.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Document moved to trash",
        description: "The document has been moved to trash and can be restored from your profile",
      });
      
      onDeleted(analysis.id);
    } catch (error) {
      console.error("Error moving document to trash:", error);
      toast({
        title: "Error moving document to trash",
        description: error.message || "Failed to move document to trash",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('document_analyses')
        .delete()
        .eq('id', analysis.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Document permanently deleted",
        description: "The document has been permanently removed",
      });
      
      if (onPermanentDelete) {
        onPermanentDelete(analysis.id);
      }
    } catch (error) {
      console.error("Error permanently deleting document:", error);
      toast({
        title: "Error deleting document",
        description: error.message || "Failed to delete document permanently",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      
      const { error } = await supabase
        .from('document_analyses')
        .update({ 
          is_deleted: false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', analysis.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Document restored",
        description: "The document has been restored successfully",
      });
      
      onDeleted(analysis.id);
    } catch (error) {
      console.error("Error restoring document:", error);
      toast({
        title: "Error restoring document",
        description: error.message || "Failed to restore document",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const canShowSummary = analysis.analysis_status === 'completed' && !analysis.is_deleted;
  const hasSummary = analysis.summary && analysis.summary.trim().length > 0 && 
                     analysis.summary !== 'null' && analysis.summary !== 'undefined';

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <FileText className={`h-6 w-6 mt-1 ${analysis.is_deleted ? 'text-gray-400' : 'text-blue-500'}`} />
          <div className="flex-1">
            <h3 className={`font-medium ${analysis.is_deleted ? 'text-gray-500 line-through' : ''}`}>
              {analysis.original_name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(analysis.created_at).toLocaleDateString()} {new Date(analysis.created_at).toLocaleTimeString()}
            </p>
            {analysis.is_deleted && (
              <p className="text-xs text-red-500 mt-1">Moved to trash</p>
            )}
            <div className="mt-2">
              {analysis.analysis_status === 'pending' && !analysis.is_deleted ? (
                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Lightning AI analysis in progress...</p>
                </div>
              ) : analysis.analysis_status === 'failed' ? (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  Analysis failed. Please try uploading again.
                </div>
              ) : !analysis.is_deleted ? (
                <div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
                    <p className="font-medium text-primary mb-1">Lightning AI Summary:</p>
                    {hasSummary ? (
                      <p className="line-clamp-3">{analysis.summary}</p>
                    ) : (
                      <div className="text-red-600">
                        <p>⚠️ No summary available</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="mt-2 text-xs"
                        >
                          {isRefreshing ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3 mr-1" />
                          )}
                          Refresh
                        </Button>
                      </div>
                    )}
                  </div>
                  {canShowSummary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs" 
                      onClick={viewSummary}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full Analysis
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {!analysis.is_deleted && <StatusIcon status={analysis.analysis_status} />}
          
          <div className="flex gap-2">
            {showRestore && analysis.is_deleted ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestore}
                  disabled={isRestoring}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  {isRestoring ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Restore"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : !analysis.is_deleted && analysis.analysis_status !== 'pending' ? (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showRestore && analysis.is_deleted ? "Permanently Delete Document" : "Move Document to Trash"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showRestore && analysis.is_deleted 
                ? "Are you sure you want to permanently delete this document? This action cannot be undone."
                : "Are you sure you want to move this document to trash? You can restore it later from your profile."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={showRestore && analysis.is_deleted ? handlePermanentDelete : handleSoftDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {showRestore && analysis.is_deleted ? "Deleting..." : "Moving to Trash..."}
                </>
              ) : (
                showRestore && analysis.is_deleted ? "Delete Permanently" : "Move to Trash"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
