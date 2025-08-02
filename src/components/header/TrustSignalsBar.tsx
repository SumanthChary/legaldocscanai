import { Shield, Award, Users } from "lucide-react";

export const TrustSignalsBar = () => {
  return (
    <div className="bg-legal-navy/5 border-b border-neutral-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center space-x-6 text-sm text-neutral-600">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-legal-gold" />
            <span>SOC 2 Certified</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <Award className="h-4 w-4 text-legal-gold" />
            <span>ABA Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-legal-gold" />
            <span>3,200+ Legal Professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
};