
import { Shield, Users, Clock, Award, TrendingUp, CheckCircle } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const TrustIndicators = () => {
  const stats = [
    { icon: Users, value: "10,000+", label: "Legal Professionals" },
    { icon: CheckCircle, value: "2M+", label: "Documents Analyzed" },
    { icon: Clock, value: "500K+", label: "Hours Saved" },
    { icon: TrendingUp, value: "95%", label: "Accuracy Rate" },
    { icon: Shield, value: "100%", label: "SOC 2 Compliant" },
    { icon: Award, value: "4.9/5", label: "Customer Rating" }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-600 mb-2">TRUSTED BY INDUSTRY LEADERS</p>
            <h2 className="text-2xl font-bold text-gray-900">Proven Results You Can Trust</h2>
          </div>
        </InView>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </div>
  );
};
