import { Shield, CheckCircle, Users } from "lucide-react";

export const TrustBar = () => {
  return (
    <div className="bg-navy-900 text-white py-2 px-4">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs md:text-sm">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 md:h-4 md:w-4 text-gold-400" />
            <span>SOC 2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-gold-400" />
            <span>ABA Technology Guidelines Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3 w-3 md:h-4 md:w-4 text-gold-400" />
            <span>3,200+ Legal Professionals Trust Us</span>
          </div>
        </div>
      </div>
    </div>
  );
};