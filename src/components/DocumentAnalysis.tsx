import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const DocumentAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
    subscribeToAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    const { data, error } = await supabase
      .from('document_analyses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching analyses",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAnalyses(data || []);
    }
  };

  const subscribeToAnalyses = () => {
    const channel = supabase
      .channel('document_analyses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses'
        },
        (payload) => {
          fetchAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload documents",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('analyze-document', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "Document uploaded successfully",
        description: "Analysis has started...",
      });
      setFile(null);
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
        <div className="flex gap-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Analyses</h2>
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <FileText className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium">{analysis.original_name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                    {analysis.summary && (
                      <p className="mt-2 text-sm text-gray-700">{analysis.summary}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  {analysis.analysis_status === 'pending' ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </Card>
          ))}
          {analyses.length === 0 && (
            <p className="text-center text-gray-500">No documents analyzed yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};