
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ESignaturesHeroSection } from "./ESignaturesHeroSection";
import { UploadForm } from "@/components/esignatures/UploadForm";
import { SignatureRequestsList } from "@/components/esignatures/SignatureRequestsList";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

export default function ESignatures() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signature_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 px-2 md:px-6 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center gap-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-purple-100 bg-white/70 hover:bg-purple-50 hover:shadow-lg shadow-md md:ml-1 transition-all gap-1"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5 text-purple-700" />
          <span className="font-medium text-purple-900">Back</span>
        </Button>
      </div>

      {/* Hero Section */}
      <ESignaturesHeroSection />

      {/* Upload Form & Image */}
      <section className="flex flex-col-reverse lg:flex-row gap-8 mb-12 items-stretch animate-fade-in">
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            src="/lovable-uploads/87ef7b87-6da4-45d5-922b-7851221679c0.png"
            alt="Smiling person using e-signature"
            className="rounded-2xl shadow-lg max-w-xs md:max-w-sm ring-2 ring-purple-200 object-cover w-full transition-transform duration-300 hover:scale-105"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
        <UploadForm user={user} fetchRequests={fetchRequests} />
      </section>

      {/* Requests List */}
      <SignatureRequestsList 
        requests={requests} 
        loading={loading} 
        onRefresh={fetchRequests}
      />
    </div>
  );
}
