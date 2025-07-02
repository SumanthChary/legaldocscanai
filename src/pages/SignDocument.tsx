
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, X } from "lucide-react";
import { SignatureCanvas } from "@/components/esignatures/SignatureCanvas";

type SigningSession = {
  id: string;
  field_id: string;
  signer_email: string;
  session_token: string;
  expires_at: string;
  signed: boolean;
  signature_fields: {
    id: string;
    field_type: string;
    position: any;
    signature_requests: {
      id: string;
      document_name: string;
      document_path: string;
      status: string;
    };
  };
};

export default function SignDocument() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<SigningSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchSigningSession();
    }
  }, [token]);

  const fetchSigningSession = async () => {
    try {
      // Use service role or create a public RLS policy for this specific query
      const { data, error } = await supabase
        .from("signing_sessions")
        .select(`
          *,
          signature_fields (
            id,
            field_type,
            position,
            signature_requests (
              id,
              document_name,
              document_path,
              status
            )
          )
        `)
        .eq("session_token", token)
        .single();

      if (error) {
        console.error("Error fetching signing session:", error);
        toast({
          title: "Invalid signing link",
          description: "This signing link is invalid or has expired.",
          variant: "destructive",
        });
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        toast({
          title: "Link expired",
          description: "This signing link has expired.",
          variant: "destructive",
        });
        return;
      }

      if (data.signed) {
        toast({
          title: "Already signed",
          description: "This document has already been signed.",
        });
        return;
      }

      setSession(data);
      
      // Get document URL from storage
      const { data: urlData } = await supabase.storage
        .from("esignatures")
        .createSignedUrl(data.signature_fields.signature_requests.document_path, 3600);
      
      if (urlData?.signedUrl) {
        setDocumentUrl(urlData.signedUrl);
      }
    } catch (error) {
      console.error("Error fetching signing session:", error);
      toast({
        title: "Error",
        description: "Failed to load signing session.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!signature || !session) return;

    setSigning(true);
    try {
      // Insert signature - this needs to work for anonymous users
      const { error: signatureError } = await supabase
        .from("signatures")
        .insert({
          field_id: session.field_id,
          signer_email: session.signer_email,
          signature_image: signature,
          ip_address: "unknown",
          user_agent: navigator.userAgent,
        });

      if (signatureError) {
        console.error("Signature error:", signatureError);
        throw signatureError;
      }

      // Update signing session
      const { error: sessionError } = await supabase
        .from("signing_sessions")
        .update({ signed: true })
        .eq("id", session.id);

      if (sessionError) {
        console.error("Session update error:", sessionError);
        throw sessionError;
      }

      // Update signature request status
      const { error: requestError } = await supabase
        .from("signature_requests")
        .update({ status: "completed" })
        .eq("id", session.signature_fields.signature_requests.id);

      if (requestError) {
        console.error("Request update error:", requestError);
        throw requestError;
      }

      toast({
        title: "Document signed successfully!",
        description: "Your signature has been recorded.",
      });

      // Redirect to success page
      setTimeout(() => {
        navigate("/sign-success");
      }, 2000);
    } catch (error: any) {
      console.error("Error signing document:", error);
      toast({
        title: "Failed to sign document",
        description: error.message || "An error occurred while signing.",
        variant: "destructive",
      });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
          <p className="text-gray-600">
            This signing link is invalid, expired, or has already been used.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Sign Document</h1>
          <p className="text-gray-600 mb-4">
            You've been asked to sign: <strong>{session.signature_fields.signature_requests.document_name}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Signer: {session.signer_email}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Preview */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Document Preview</h2>
            {documentUrl ? (
              <iframe
                src={documentUrl}
                className="w-full h-96 border rounded"
                title="Document Preview"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-500">Loading document...</p>
              </div>
            )}
          </Card>

          {/* Signature Area */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Your Signature</h2>
            <SignatureCanvas onSignature={setSignature} />
            <div className="mt-4 space-y-2">
              <Button
                onClick={handleSign}
                disabled={!signature || signing}
                className="w-full"
              >
                {signing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Sign Document
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                By clicking "Sign Document", you agree to electronically sign this document.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
