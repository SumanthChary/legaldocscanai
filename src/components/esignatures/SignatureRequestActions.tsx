
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Copy, Eye, Trash2, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFViewer } from "./PDFViewer";

type SignatureField = {
  id: string;
  assigned_signer_email: string;
  field_type: string;
  required: boolean;
};

type SignatureRequestActionsProps = {
  request: {
    id: string;
    document_name: string;
    document_path: string;
    status: string;
    created_at: string;
  };
  fields: SignatureField[];
  onUpdate: () => void;
};

export function SignatureRequestActions({ request, fields, onUpdate }: SignatureRequestActionsProps) {
  const [newSignerEmail, setNewSignerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addSigner = async () => {
    if (!newSignerEmail.trim()) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("signature_fields")
        .insert({
          request_id: request.id,
          assigned_signer_email: newSignerEmail,
          field_type: "signature",
          position: JSON.stringify({ page: 1, x: 100, y: 200, width: 200, height: 60 }),
          required: true,
        });

      if (error) throw error;

      toast({ title: "Signer added successfully!" });
      setNewSignerEmail("");
      onUpdate();
    } catch (error: any) {
      toast({ title: "Failed to add signer", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateSigningLink = (signerEmail: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/sign/${request.id}?email=${encodeURIComponent(signerEmail)}`;
  };

  const copySigningLink = (signerEmail: string) => {
    const link = generateSigningLink(signerEmail);
    navigator.clipboard.writeText(link);
    toast({ title: "Signing link copied to clipboard!" });
  };

  const sendSigningEmail = async (signerEmail: string) => {
    // This would integrate with an email service
    const link = generateSigningLink(signerEmail);
    toast({ 
      title: "Email sent!", 
      description: `Signing link sent to ${signerEmail}` 
    });
  };

  const deleteRequest = async () => {
    if (!confirm("Are you sure you want to delete this signature request?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("signature_requests")
        .delete()
        .eq("id", request.id);

      if (error) throw error;

      toast({ title: "Signature request deleted" });
      onUpdate();
    } catch (error: any) {
      toast({ title: "Failed to delete request", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{request.document_name}</h3>
          <p className="text-sm text-gray-500">Created: {new Date(request.created_at).toLocaleDateString()}</p>
        </div>
        <Badge className={getStatusColor(request.status)}>
          {request.status}
        </Badge>
      </div>

      <PDFViewer 
        documentPath={request.document_path} 
        documentName={request.document_name} 
      />

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <h4 className="font-medium">Signers ({fields.length})</h4>
        </div>

        {fields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{field.assigned_signer_email}</div>
              <Badge variant="outline" className="text-xs">
                {field.field_type}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copySigningLink(field.assigned_signer_email)}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sendSigningEmail(field.assigned_signer_email)}
              >
                <Mail className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Input
            placeholder="Add signer email"
            value={newSignerEmail}
            onChange={(e) => setNewSignerEmail(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addSigner} disabled={loading}>
            Add Signer
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => copySigningLink(fields[0]?.assigned_signer_email || "")}
          disabled={fields.length === 0}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button
          variant="outline"
          onClick={deleteRequest}
          disabled={loading}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
