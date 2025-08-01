import { Lock, Eye, Trash2 } from "lucide-react";

export const ComplianceStatement = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Attorney Work Product Privileged</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Zero Data Retention</span>
        </div>
        <div className="w-px h-6 bg-slate-300"></div>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-slate-600" />
          <span className="text-sm font-semibold text-slate-700">Attorney-Client Privilege Protected</span>
        </div>
      </div>
    </div>
  );
};