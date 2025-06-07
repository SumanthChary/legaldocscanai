
import { Card } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { AnalysisContent } from "./components/AnalysisContent";
import { AnalysisActions } from "./components/AnalysisActions";
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
      const { data, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', analysis.id)
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Analysis refreshed",
        description: "Latest analysis data has been loaded",
      });
      
      if (onRefresh) onRefresh();
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
            
            <AnalysisContent
              analysis={analysis}
              isRestoring={isRestoring}
              isRefreshing={isRefreshing}
              showRestore={showRestore}
              onRestore={handleRestore}
              onDelete={() => setShowDeleteConfirm(true)}
              onRefresh={handleRefresh}
              onViewSummary={viewSummary}
            />
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {!analysis.is_deleted && <StatusIcon status={analysis.analysis_status} />}
          
          <AnalysisActions
            isDeleted={analysis.is_deleted}
            isRestoring={isRestoring}
            showRestore={showRestore}
            onRestore={handleRestore}
            onDelete={() => setShowDeleteConfirm(true)}
          />
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
