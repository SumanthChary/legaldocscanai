
import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ESignaturesHeroSection } from "./ESignaturesHeroSection";
import { UploadForm } from "@/components/esignatures/UploadForm";
import { SignatureRequestsList } from "@/components/esignatures/SignatureRequestsList";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SignatureRequest = {
  id: string;
  document_name: string;
  document_path: string;
  status: string;
  created_at: string;
};

const LoadingSkeleton = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <div className="flex justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default function ESignatures() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);

  if (!user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 px-2 md:px-6 animate-fade-in">
      <div className="flex items-center gap-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full border border-purple-100 bg-white/70 hover:bg-purple-50 hover:shadow-lg shadow-md md:ml-1 transition-all gap-1 hover:scale-105"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5 text-purple-700" />
          <span className="font-medium text-purple-900">Back</span>
        </Button>
      </div>

      <ESignaturesHeroSection />

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

      <SignatureRequestsList 
        requests={requests} 
        loading={loading} 
        onRefresh={fetchRequests}
      />
    </div>
  );
}
