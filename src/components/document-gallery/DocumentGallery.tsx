
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { DocumentUsage } from "./DocumentUsage";
import { DocumentCard } from "./DocumentCard";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";

interface DocumentGalleryProps {
  userId: string;
}

export const DocumentGallery = ({ userId }: DocumentGalleryProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [expandedDocs, setExpandedDocs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      const { data: docs, error } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('user_id', userId)
        .or('is_deleted.is.null,is_deleted.eq.false')
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
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const fetchProfile = async () => {
    try {
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
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await Promise.all([fetchDocuments(), fetchProfile()]);
  };

  useEffect(() => {
    fetchDocuments();
    fetchProfile();

    // Set up real-time subscription for document updates
    const channel = supabase
      .channel('document_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_analyses',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          fetchDocuments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log("Profile update received:", payload);
          fetchProfile();
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const toggleSummary = (docId: string) => {
    setExpandedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <DocumentUsage userProfile={userProfile} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            doc={doc} 
            expandedDocs={expandedDocs} 
            toggleSummary={toggleSummary} 
          />
        ))}
      </div>

      {documents.length === 0 && <EmptyState />}
    </div>
  );
};
