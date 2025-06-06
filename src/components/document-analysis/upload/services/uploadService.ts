
import { supabase } from "@/integrations/supabase/client";

export const uploadService = {
  async uploadDocument(file: File): Promise<{ success: boolean; analysis_id?: string; message: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    formData.append('file', file);
    
    const response = await supabase.functions.invoke('analyze-document', {
      body: formData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    if (response.error) {
      throw new Error(response.error.message || "Upload failed");
    }

    if (!response.data?.analysis_id) {
      throw new Error("Analysis failed - no ID returned");
    }

    return response.data;
  }
};
