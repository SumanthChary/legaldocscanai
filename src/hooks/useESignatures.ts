
import { useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
  user_id: string;
};

export function useESignatures(userId?: string) {
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signature_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast({ 
        title: "Failed to load requests", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const createRequest = useCallback(async (
    documentName: string, 
    documentPath: string, 
    signerEmail: string
  ) => {
    if (!userId) throw new Error("User not authenticated");

    try {
      // Insert signature_request
      const { data: requestData, error: requestError } = await supabase
        .from("signature_requests")
        .insert({
          user_id: userId,
          document_name: documentName,
          document_path: documentPath,
          status: "pending"
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Insert signature_field
      const { error: fieldError } = await supabase
        .from("signature_fields")
        .insert({
          request_id: requestData.id,
          assigned_signer_email: signerEmail,
          field_type: "signature",
          position: JSON.stringify({ page: 1, x: 100, y: 200, width: 200, height: 60 }),
          required: true,
        });

      if (fieldError) throw fieldError;

      toast({ title: "Signature request created successfully!" });
      await fetchRequests();
      
      return requestData;
    } catch (error: any) {
      console.error("Error creating request:", error);
      toast({ 
        title: "Failed to create request", 
        description: error.message, 
        variant: "destructive" 
      });
      throw error;
    }
  }, [userId, toast, fetchRequests]);

  const deleteRequest = useCallback(async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("signature_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      toast({ title: "Signature request deleted" });
      await fetchRequests();
    } catch (error: any) {
      console.error("Error deleting request:", error);
      toast({ 
        title: "Failed to delete request", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  }, [toast, fetchRequests]);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    completed: requests.filter(r => r.status === 'completed').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
  }), [requests]);

  return {
    requests,
    loading,
    stats,
    fetchRequests,
    createRequest,
    deleteRequest,
  };
}
