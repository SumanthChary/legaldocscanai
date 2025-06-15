
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Pen, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FancyFileInput } from "./FancyFileInput";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  user: any;
  fetchRequests: () => void;
};

export function UploadForm({ user, fetchRequests }: Props) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [signerEmail, setSignerEmail] = useState("");

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
    <Card className="flex-1 rounded-2xl shadow-xl p-6 md:p-10 bg-white/75 backdrop-blur-md border border-purple-100">
      <div className="flex items-center gap-2 mb-6">
        <Upload className="text-purple-700 w-6 h-6" />
        <h2 className="font-bold text-lg md:text-2xl text-purple-900 tracking-tight">
          New E-Signature Request
        </h2>
      </div>
      <form onSubmit={handleUpload} className="space-y-6">
        <FancyFileInput file={file} setFile={setFile} uploading={uploading} />
        <div>
          <label className="text-sm font-medium text-purple-800 block mb-1">Signer Email</label>
          <Input
            type="email"
            placeholder="name@example.com"
            required
            value={signerEmail}
            onChange={e => setSignerEmail(e.target.value)}
            disabled={uploading}
            className="bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400"
          />
        </div>
        <Button
          type="submit"
          disabled={uploading}
          className="w-full bg-gradient-to-tr from-purple-600 to-blue-400 hover:from-purple-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              Creating...
            </span>
          ) : (
            <>
              <Pen className="mr-2" /> Create Signature Request
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
