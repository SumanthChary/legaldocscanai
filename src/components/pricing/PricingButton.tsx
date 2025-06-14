
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PlanType {
  name: string;
  price: string;
  period: string;
}

interface PricingButtonProps {
  plan: PlanType;
  className?: string;
}

export const PricingButton = ({ plan, className }: PricingButtonProps) => {
  const navigate = useNavigate();
  const isFree = plan.price === "0";

  const handleGetStarted = async () => {
    // Check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue",
      });
      navigate("/auth", {
        state: {
          redirectAfterAuth: "/pricing",
          selectedPlan: plan
        }
      });
      return;
    }

    // Check user's current plan status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("document_limit, document_count, email")
      .eq("id", session.user.id)
      .single();

    if (!profileError && profile) {
      // Special handling for enjoywithpandu@gmail.com - always has unlimited access
      if (profile.email === 'enjoywithpandu@gmail.com') {
        toast({
          title: "Admin Account Detected",
          description: "You already have unlimited access to all features",
        });
        navigate("/dashboard");
        return;
      }

      // Check if user already has unlimited access (through payment)
      if (profile.document_limit >= 999999) {
        toast({
          title: "You already have unlimited access",
          description: "Your account has premium capabilities",
        });
        navigate("/dashboard");
        return;
      }

      // For the free plan, check if the user is eligible
      if (isFree && profile.document_limit > 3) {
        // User already has more than the default free plan limit
        toast({
          title: "You already have an active plan",
          description: "Your current plan includes more documents than the free plan",
        });
        navigate("/dashboard");
        return;
      }
    }

    // Navigate to payment page for paid plans or dashboard for free plan
    if (isFree) {
      navigate("/dashboard");
      toast({
        title: "Free plan activated",
        description: "You now have access to 3 free document analyses",
      });
    } else {
      navigate("/payment", { 
        state: { 
          plan: {
            name: plan.name,
            price: plan.name === "Free" ? "0" : `$${plan.price}`,
            period: plan.period
          }
        }
      });
    }
  };

  return (
    <Button
      className={`w-full text-sm md:text-base py-2 md:py-3 ${className}`}
      variant={isFree ? "outline" : "default"}
      size="lg"
      onClick={handleGetStarted}
    >
      {isFree ? "Start Free Trial" : "Get Started"}
    </Button>
  );
};
