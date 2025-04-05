
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface PricingHeaderProps {
  onRedeemClick: () => void;
}

export const PricingHeader = ({ onRedeemClick }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Start with 3 Free Documents
      </h1>
      <p className="text-xl text-gray-600">
        Try our document analyzer for free, then choose the plan that's right for you
      </p>
      <Button 
        onClick={onRedeemClick}
        variant="outline"
        className="mt-4 flex items-center mx-auto"
      >
        <Ticket className="mr-2 h-4 w-4" />
        Redeem a Promotion Code
      </Button>
    </div>
  );
};
