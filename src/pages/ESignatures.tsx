
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ESignaturesHeroSection } from "./ESignaturesHeroSection";
import { UploadForm } from "@/components/esignatures/UploadForm";
import { SignatureRequestsList } from "@/components/esignatures/SignatureRequestsList";
import { useToast } from "@/components/ui/use-toast";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

export default function ESignatures() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error: any) {
        console.error("Auth error:", error);
        toast({ 
          title: "Authentication required", 
          description: "Please sign in to use E-Signatures", 
          variant: "destructive" 
        });
        navigate("/auth");
      }
    };
    
    initializeUser();
  }, [navigate, toast]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("signature_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast({ 
        title: "Failed to load requests", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
            loading="lazy"
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
