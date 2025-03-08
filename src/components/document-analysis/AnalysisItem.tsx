
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ExternalLink, Trash2 } from "lucide-react";
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
  };
  onDeleted?: () => void;
};

export const AnalysisItem = ({ analysis, onDeleted }: AnalysisItemProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const viewSummary = () => {
    navigate(`/document/${analysis.id}/summary`);
  };

  const handleDelete = async () => {
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
        title: "Document deleted",
        description: "The document has been successfully removed",
      });
      
      // Call the onDeleted callback to refresh the list
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error deleting document",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <FileText className="h-6 w-6 text-blue-500 mt-1" />
          <div className="flex-1">
            <h3 className="font-medium">{analysis.original_name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(analysis.created_at).toLocaleDateString()} {new Date(analysis.created_at).toLocaleTimeString()}
            </p>
            <div className="mt-2">
              {analysis.analysis_status === 'pending' ? (
                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">AI is analyzing your document...</p>
                </div>
              ) : analysis.analysis_status === 'failed' ? (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                  Analysis failed. Please try uploading again.
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md mb-2">
                    <p className="font-medium text-primary mb-1">AI Summary:</p>
                    {analysis.summary ? (
                      <p className="line-clamp-3">{analysis.summary}</p>
                    ) : (
                      <p className="text-gray-500">No summary available</p>
                    )}
                  </div>
                  {analysis.summary && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs" 
                      onClick={viewSummary}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Full Summary
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusIcon status={analysis.analysis_status} />
          
          {analysis.analysis_status !== 'pending' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete document</span>
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
