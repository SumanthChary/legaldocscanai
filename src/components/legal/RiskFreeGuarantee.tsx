import { Shield, CheckCircle } from "lucide-react";

export const RiskFreeGuarantee = () => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-amber-800">14-Day Money-Back Guarantee</h3>
          <p className="text-sm text-amber-700">No questions asked</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
        <CheckCircle className="h-4 w-4" />
        <span>Risk-free trial • Cancel anytime • Full refund guaranteed</span>
      </div>
    </div>
  );
};