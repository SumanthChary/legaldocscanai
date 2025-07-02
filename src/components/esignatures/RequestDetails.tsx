
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { SigningLinkGenerator } from "./SigningLinkGenerator";
import { FileText, User, Calendar, ExternalLink } from "lucide-react";

type RequestDetailsProps = {
  requestId: string;
  onClose: () => void;
};

type RequestDetail = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
  signature_fields: Array<{
    id: string;
    assigned_signer_email: string;
    field_type: string;
    required: boolean;
    signatures: Array<{
      id: string;
      signed_at: string;
      signer_email: string;
    }>;
  }>;
};

export function RequestDetails({ requestId, onClose }: RequestDetailsProps) {
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("signature_requests")
        .select(`
          *,
          signature_fields (
            id,
            assigned_signer_email,
            field_type,
            required,
            signatures (
              id,
              signed_at,
              signer_email
            )
          )
        `)
        .eq("id", requestId)
        .single();

      if (error) {
        console.error("Error fetching request details:", error);
        return;
      }

      setRequest(data);

      // Get document URL
      const { data: urlData } = await supabase.storage
        .from("esignatures")
        .createSignedUrl(data.document_path, 3600);

      if (urlData?.signedUrl) {
        setDocumentUrl(urlData.signedUrl);
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkGenerated = (link: string) => {
    console.log("Signing link generated:", link);
  };

  if (loading || !request) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Request Details</h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">{request.document_name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Created: {new Date(request.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>

        {documentUrl && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => window.open(documentUrl, '_blank')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Document
            </Button>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Signers</h3>
        {request.signature_fields.map((field) => {
          const signature = field.signatures[0];
          const isSigned = !!signature;

          return (
            <div key={field.id} className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{field.assigned_signer_email}</span>
                  </div>
                  <Badge className={isSigned ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {isSigned ? "Signed" : "Pending"}
                  </Badge>
                </div>
                
                {isSigned ? (
                  <p className="text-sm text-gray-600">
                    Signed on {new Date(signature.signed_at).toLocaleString()}
                  </p>
                ) : (
                  <div className="mt-4">
                    <SigningLinkGenerator
                      requestId={request.id}
                      signerEmail={field.assigned_signer_email}
                      documentName={request.document_name}
                      onLinkGenerated={handleLinkGenerated}
                    />
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
