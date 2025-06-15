
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, FileText, Check, Pen, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ESignaturesHeroSection } from "./ESignaturesHeroSection";

// ESignature types
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
    // eslint-disable-next-line
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
    <div className="max-w-4xl mx-auto pb-10 animate-fade-in">
      {/* Modern SaaS hero section */}
      <ESignaturesHeroSection />

      {/* Upload Area and Form */}
      <section className="flex flex-col md:flex-row gap-8 mb-12 items-stretch animate-fade-in">
        <Card className="flex-1 rounded-xl shadow-lg p-8 md:p-10 bg-white/70 backdrop-blur-md border border-purple-100">
          <div className="flex items-center gap-2 mb-6">
            <Upload className="text-purple-700 w-6 h-6" />
            <h2 className="font-bold text-lg md:text-2xl text-purple-900 tracking-tight">
              New E-Signature Request
            </h2>
          </div>
          <form onSubmit={handleUpload} className="space-y-6">
            <Input
              type="file"
              accept="application/pdf"
              required
              onChange={e => setFile(e.target.files?.[0] || null)}
              disabled={uploading}
              className="file:font-semibold file:bg-purple-50 file:text-purple-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-4"
            />
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
        {/* Cute image for positivity (hidden on mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img
            src="/lovable-uploads/photo-1581091226825-a6a2a5aee158.png"
            alt="Smiling person using e-signature"
            className="rounded-xl shadow-lg max-w-xs md:max-w-sm ring-2 ring-purple-200"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Requests List */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6 pl-1">
          <FileText className="text-blue-500 w-5 h-5" />
          <h3 className="text-lg md:text-xl font-semibold text-purple-800">My Signature Requests</h3>
        </div>
        {loading ? (
          <div className="py-8 text-center flex justify-center rounded">
            <Loader2 className="animate-spin text-purple-700" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {requests.map(r => (
              <div key={r.id} className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 rounded-lg flex flex-col gap-3 shadow hover:shadow-md transition shadow-purple-100/30">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="text-purple-700 w-4 h-4" />
                  <span className="font-semibold text-purple-900 truncate">{r.document_name}</span>
                </div>
                <div className="flex flex-row gap-4 items-end justify-between">
                  <span className={`text-xs rounded-full px-3 py-1 font-bold capitalize transition 
                    ${r.status === "pending" ? "bg-purple-100 text-purple-800"
                      : r.status === "completed" ? "bg-green-100 text-green-800"
                      : r.status === "in_progress" ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-500"}`}>
                    {r.status}
                  </span>
                  {r.status === "completed" ? (
                    <Check className="w-5 h-5 text-green-500 animate-pulse" title="Completed" />
                  ) : (
                    <Pen className="w-5 h-5 text-purple-400" title="Awaiting signature" />
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-3">
                  Created: {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="col-span-full text-purple-400 text-center py-14 font-semibold text-lg rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow">
                No requests yet.<br />
                <span className="text-base font-normal block mt-2 text-purple-300">Create your first e-signature request above!</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
