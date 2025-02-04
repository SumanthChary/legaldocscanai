import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface DocumentGalleryProps {
  userId: string;
}

export const DocumentGallery = ({ userId }: DocumentGalleryProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
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

  return (
    <div className="space-y-6">
      {userProfile && (
        <Card className="p-6">
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
          <Card key={doc.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.original_name}
                </p>
                <p className="text-sm text-gray-500">
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
                {doc.summary && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {doc.summary}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <Card className="p-8 text-center">
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