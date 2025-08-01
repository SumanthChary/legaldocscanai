import { Shield, Lock, FileCheck, Globe } from "lucide-react";

export const SecurityBadges = () => {
  const badges = [
    { icon: Shield, label: "SOC 2 Type II", color: "from-blue-500 to-blue-600" },
    { icon: Globe, label: "GDPR Compliant", color: "from-green-500 to-green-600" },
    { icon: FileCheck, label: "ABA Guidelines", color: "from-purple-500 to-purple-600" },
    { icon: Lock, label: "Bank-Grade Security", color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm"
        >
          <div className={`w-6 h-6 rounded bg-gradient-to-r ${badge.color} flex items-center justify-center`}>
            <badge.icon className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">{badge.label}</span>
        </div>
      ))}
    </div>
  );
};