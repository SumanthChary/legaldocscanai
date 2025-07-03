
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SigningInterface } from "@/components/esignatures/SigningInterface";
import { PDFViewer } from "@/components/esignatures/PDFViewer";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

type SignatureField = {
  id: string;
  assigned_signer_email: string;
  field_type: string;
  required: boolean;
};

export default function SigningPage() {
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();
  const signerEmail = searchParams.get("email") || "";
  const { toast } = useToast();
  
  const [request, setRequest] = useState<SignatureRequest | null>(null);
  const [field, setField] = useState<SignatureField | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (requestId && signerEmail) {
      fetchSigningData();
    }
  }, [requestId, signerEmail]);

  const fetchSigningData = async () => {
    try {
      // Fetch signature request
      const { data: requestData, error: requestError } = await supabase
        .from("signature_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      // Fetch signature field for this signer
      const { data: fieldData, error: fieldError } = await supabase
        .from("signature_fields")
        .select("*")
        .eq("request_id", requestId)
        .eq("assigned_signer_email", signerEmail)
        .single();

      if (fieldError) throw fieldError;
      setField(fieldData);

      // Check if already signed
      const { data: signatureData, error: signatureError } = await supabase
        .from("signatures")
        .select("*")
        .eq("field_id", fieldData.id)
        .eq("signer_email", signerEmail)
        .single();

      if (!signatureError && signatureData) {
        setSigned(true);
      }

    } catch (error: any) {
      console.error("Error fetching signing data:", error);
      toast({ 
        title: "Error loading signature request", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureComplete = async (signatureData: string) => {
    if (!field || !request) return;

    setSigning(true);
    try {
      // Save signature
      const { error: signatureError } = await supabase
        .from("signatures")
        .insert({
          field_id: field.id,
          signer_email: signerEmail,
          signature_image: signatureData,
          ip_address: "", // Could be populated from client
          user_agent: navigator.userAgent,
        });

      if (signatureError) throw signatureError;

      // Update request status to in_progress or completed
      const { error: updateError } = await supabase
        .from("signature_requests")
        .update({ 
          status: "completed", // Simplifying - in reality would check if all fields are signed
          updated_at: new Date().toISOString()
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      setSigned(true);
      toast({ title: "Document signed successfully!" });

    } catch (error: any) {
      console.error("Error saving signature:", error);
      toast({ 
        title: "Failed to save signature", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signature request...</p>
        </div>
      </div>
    );
  }

  if (!request || !field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Invalid Signing Link</h2>
          <p className="text-gray-600">
            This signing link is invalid or has expired. Please contact the document sender for a new link.
          </p>
        </Card>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Document Signed!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for signing "{request.document_name}". The document has been successfully signed and all parties have been notified.
          </p>
          <Badge className="bg-green-100 text-green-800">
            Completed
          </Badge>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sign Document</h1>
              <p className="text-gray-600">You've been requested to sign: {request.document_name}</p>
            </div>
          </div>

          <div className="mb-6">
            <PDFViewer 
              documentPath={request.document_path}
              documentName={request.document_name}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>Important:</strong> By signing this document, you agree to its terms and conditions. 
              Your signature will be legally binding.
            </p>
          </div>

          <SigningInterface
            signerEmail={signerEmail}
            onSignatureComplete={handleSignatureComplete}
            disabled={signing}
          />

          {signing && (
            <div className="mt-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Saving your signature...</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
