
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  
  const isPremium = Number(plan.price) >= 20;
  const isFree = plan.price === "0";
  const isExpensive = Number(plan.price) >= 99;

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
      className={`w-full relative group transition-all duration-300 ${className}`}
      variant={isFree ? "outline" : "pricing"}
      size="lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleGetStarted}
    >
      {!isFree && (
        <span className={`absolute -left-2 -top-2 bg-primary text-white text-xs px-2 py-1 rounded-full transition-all ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {isExpensive ? "Best Value" : "Popular"}
        </span>
      )}
      
      {isPremium && !isHovered ? (
        <span className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          {plan.price}
          <span className="text-xs">{plan.period}</span>
        </span>
      ) : (
        <span>{isFree ? "Start Free Trial" : "Get Started"}</span>
      )}
      
      {!isFree && (
        <span className={`absolute inset-0 bg-accent/20 transform origin-left ${isHovered ? 'scale-x-0' : 'scale-x-100'} transition-transform duration-300`}></span>
      )}
    </Button>
  );
};
