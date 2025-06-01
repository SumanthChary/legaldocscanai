
import { Shield, Lock, Eye, FileCheck, Award, Zap } from "lucide-react";
import { InView } from "@/components/ui/in-view";

export const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Type II",
      description: "Certified security controls"
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Military-grade protection"
    },
    {
      icon: Eye,
      title: "GDPR Compliant",
      description: "European privacy standards"
    },
    {
      icon: FileCheck,
      title: "HIPAA Ready",
      description: "Healthcare data protection"
    },
    {
      icon: Award,
      title: "ISO 27001",
      description: "International security standard"
    },
    {
      icon: Zap,
      title: "Zero Trust",
      description: "Advanced security architecture"
    }
  ];

  const guarantees = [
    "30-day money-back guarantee",
    "99.9% uptime SLA",
    "24/7 enterprise support",
    "Data residency options"
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your sensitive legal documents deserve the highest level of protection. We exceed industry standards.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {securityFeatures.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </InView>
          ))}
        </div>

        {/* Guarantees */}
        <InView
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Promise to You</h3>
              <p className="text-gray-600">We stand behind our service with industry-leading guarantees</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/60 rounded-lg p-3">
                  <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};
