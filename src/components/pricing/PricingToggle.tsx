
import { Switch } from "@/components/ui/switch";

interface PricingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
}

export const PricingToggle = ({ isAnnual, setIsAnnual }: PricingToggleProps) => {
  return (
    <div className="flex justify-center items-center gap-3 mb-10">
      <span className={`text-sm ${!isAnnual ? 'font-medium text-gray-900' : 'text-gray-600'}`}>Monthly</span>
      <Switch 
        id="billing-toggle"
        checked={isAnnual}
        onCheckedChange={setIsAnnual}
      />
      <span className={`text-sm ${isAnnual ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
        Annual <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded ml-1">Save 20%</span>
      </span>
    </div>
  );
};
