
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, FileText, Check, Pen, Upload, ArrowLeft, X } from "lucide-react";
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

// Custom File Input Component
function FancyFileInput({
  file,
  setFile,
  uploading,
}: {
  file: File | null;
  setFile: (f: File | null) => void;
  uploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop logic
  const [isDragActive, setIsDragActive] = useState(false);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragActive(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white border-2 ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-purple-200 hover:border-purple-400"
      } rounded-xl transition-all duration-200 shadow-lg px-4 py-9 cursor-pointer w-full group`}
      onClick={() => !uploading && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-disabled={uploading}
      tabIndex={0}
      style={{ minHeight: 115, outline: "none" }}
      role="button"
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        tabIndex={-1}
      />
      {!file ? (
        <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
          <Upload className="w-7 h-7 text-purple-600 mb-2 animate-fade-in" />
          <span className="text-purple-900 font-semibold">
            Drag PDF here or
            <span className="underline ml-1">Choose file</span>
          </span>
          <span className="text-xs text-purple-400">
            PDF only &mdash; Max 10MB
          </span>
        </div>
      ) : (
        <div className="flex w-full items-center gap-3 px-2 pointer-events-none">
          <FileText className="w-6 h-6 text-blue-500 animate-fade-in shrink-0" />
          <div className="flex-1 truncate text-base text-purple-900 font-medium animate-fade-in">{file.name}</div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="ml-2 !pointer-events-auto hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={e => {
              e.stopPropagation();
              setFile(null);
              fileInputRef.current!.value = "";
            }}
            tabIndex={0}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-transparent group-hover:ring-purple-300 transition" />
    </div>
  );
}

export default function ESignatures() {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    <div className="max-w-4xl mx-auto pb-10 px-2 md:px-6 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center gap-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-purple-100 bg-white/70 hover:bg-purple-50 hover:shadow-lg shadow-md md:ml-1 transition-all gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 text-purple-700" />
          <span className="font-medium text-purple-900">Back</span>
        </Button>
      </div>

      {/* Modern SaaS hero section (img swapped to user image #1) */}
      <section className="relative bg-gradient-to-br from-[#E9DFFF] via-[#F1F5F9] to-white rounded-2xl overflow-hidden shadow-lg mb-12 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center px-8 py-12 md:py-20 gap-8 md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold font-playfair text-purple-900 leading-tight mb-4 drop-shadow">
              E-Signature Requests
            </h1>
            <p className="text-base md:text-lg font-medium text-purple-700 mb-4 max-w-lg mx-auto md:mx-0">
              Effortlessly send, sign, and manage important documents in a beautiful, secure environment made with love.
            </p>
            <div className="flex gap-4 justify-center md:justify-start mt-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-purple-800 font-semibold text-sm shadow hover:bg-purple-200 transition">
                <Pen className="w-4 h-4" />
                100% Digital & Safe
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-800 font-semibold text-sm shadow hover:bg-blue-200 transition">
                <FileText className="w-4 h-4" /> PDF Only
              </span>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img 
              src="/lovable-uploads/9c906cef-9ad2-4426-b5a4-5a91a6dde116.png"
              alt="Signing on tablet"
              className="max-h-72 md:max-h-96 w-auto rounded-xl shadow-lg ring-2 ring-white ring-offset-4 ring-offset-purple-100 object-cover animate-fade-in"
            />
          </div>
        </div>
      </section>

      {/* Upload Area and Form */}
      <section className="flex flex-col-reverse lg:flex-row gap-8 mb-12 items-stretch animate-fade-in">
        {/* User image #2 displays on left (on mobile above form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            src="/lovable-uploads/87ef7b87-6da4-45d5-922b-7851221679c0.png"
            alt="Smiling person using e-signature"
            className="rounded-2xl shadow-lg max-w-xs md:max-w-sm ring-2 ring-purple-200 object-cover w-full transition-transform duration-300 hover:scale-105"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
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
      </section>

      {/* Requests List */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-2 mb-6 pl-1">
          <FileText className="text-blue-500 w-5 h-5" />
          <h3 className="text-lg md:text-xl font-semibold text-purple-800">
            My Signature Requests
          </h3>
        </div>
        {loading ? (
          <div className="py-8 text-center flex justify-center rounded">
            <Loader2 className="animate-spin text-purple-700" />
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
            {requests.map(r => (
              <div
                key={r.id}
                className={"bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-5 rounded-xl flex flex-col gap-3 shadow hover:shadow-lg transition shadow-purple-100/30 " +
                  (r.status === "completed" ? "ring-2 ring-green-200" : "")}
              >
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
                    <span>
                      <Check className="w-5 h-5 text-green-500 animate-pulse" />
                    </span>
                  ) : (
                    <span>
                      <Pen className="w-5 h-5 text-purple-400" />
                    </span>
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
