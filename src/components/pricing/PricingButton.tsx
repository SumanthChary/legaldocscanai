
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

  const handleGetStarted = () => {
    navigate("/payment", { 
      state: { 
        plan: {
          name: plan.name,
          price: plan.name === "Free" ? "0" : `$${plan.price}`,
          period: plan.period
        }
      }
    });
  };

  return (
    <Button
      className={`w-full ${className}`}
      variant={isFree ? "outline" : "default"}
      size="lg"
      onClick={handleGetStarted}
    >
      {isFree ? "Start Free Trial" : "Get Started"}
    </Button>
  );
};
