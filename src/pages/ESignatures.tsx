
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileSignature } from "lucide-react";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

export default function ESignatures() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [signerEmail, setSignerEmail] = useState("");
  const [user, setUser] = useState<any>(null);

  // Fetch current user's requests
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("signature_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setRequests(data);
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !signerEmail) {
      toast({ title: "Select a file and enter a signer email.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Authentication error", variant: "destructive" });
      return;
    }

    setUploading(true);

    // Upload PDF to Supabase Storage (bucket: 'esignatures')
    const filename = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("esignatures")
      .upload(filename, file);

    if (uploadError) {
      toast({ title: "File upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const document_path = uploadData?.path || filename;

    // Insert signature_request
    const { data: requestData, error: requestError } = await supabase
      .from("signature_requests")
      .insert({
        user_id: user.id,
        document_name: file.name,
        document_path,
        status: "pending"
      })
      .select()
      .single();

    if (requestError) {
      toast({ title: "Failed to create request", description: requestError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    // Insert a single signature_field for now
    const { error: fieldError } = await supabase
      .from("signature_fields")
      .insert({
        request_id: requestData.id,
        assigned_signer_email: signerEmail,
        field_type: "signature",
        position: JSON.stringify({ page: 1, x: 100, y: 200, width: 200, height: 60 }),
        required: true,
      });

    if (fieldError) {
      toast({ title: "Failed to add signer", description: fieldError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    toast({ title: "Signature request created!" });
    setFile(null);
    setSignerEmail("");
    fetchRequests();
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 mb-8">
        <div className="flex items-center mb-6 gap-2">
          <FileSignature className="text-purple-600" />
          <h2 className="text-xl font-bold">Create E-Signature Request</h2>
        </div>
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            type="file"
            accept="application/pdf"
            required
            onChange={e => setFile(e.target.files?.[0] || null)}
            disabled={uploading}
          />
          <Input
            type="email"
            placeholder="Signer email"
            required
            value={signerEmail}
            onChange={e => setSignerEmail(e.target.value)}
            disabled={uploading}
          />
          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Creating...
              </span>
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Card>
      <Card className="p-8">
        <div className="mb-4 flex items-center gap-2">
          <FileSignature className="text-purple-600" />
          <h3 className="font-semibold text-lg">My Signature Requests</h3>
        </div>
        {loading ? (
          <div className="py-8 text-center flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="divide-y">
            {requests.map(r => (
              <div key={r.id} className="py-4 flex justify-between">
                <span className="font-medium">{r.document_name}</span>
                <span className="text-xs rounded px-2 py-1 bg-gray-100 text-gray-600">
                  {r.status}
                </span>
              </div>
            ))}
            {requests.length === 0 && <div className="text-gray-500 py-8 text-center">No requests yet.</div>}
          </div>
        )}
      </Card>
    </div>
  );
}
