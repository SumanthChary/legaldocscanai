
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { InView } from "@/components/ui/in-view";

interface DocumentGalleryProps {
  userId: string;
}

export const DocumentGallery = ({ userId }: DocumentGalleryProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [expandedDocs, setExpandedDocs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data: docs, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching documents",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setDocuments(docs || []);
    };

    const fetchProfile = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setUserProfile(profile);
    };

    fetchDocuments();
    fetchProfile();
  }, [userId]);

  const toggleSummary = (docId: string) => {
    setExpandedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <div className="space-y-6">
      {userProfile && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Document Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents Used</span>
              <span>{userProfile.document_count} / {userProfile.document_limit}</span>
            </div>
            <Progress 
              value={(userProfile.document_count / userProfile.document_limit) * 100} 
              className="h-2"
            />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <InView key={doc.id}>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {doc.original_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.analysis_status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.analysis_status}
                      </span>
                    </div>
                  </div>
                </div>

                {doc.summary && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50"
                      onClick={() => toggleSummary(doc.id)}
                    >
                      <span className="text-sm font-medium">
                        {expandedDocs.includes(doc.id) ? "Hide Summary" : "Show Summary"}
                      </span>
                      <ChevronDown 
                        className={`h-4 w-4 transition-transform ${
                          expandedDocs.includes(doc.id) ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                    {expandedDocs.includes(doc.id) && (
                      <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                        {doc.summary}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </InView>
        ))}
      </div>

      {documents.length === 0 && (
        <Card className="p-4 sm:p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Upload your first document to get started with the analysis
          </p>
        </Card>
      )}
    </div>
  );
};
