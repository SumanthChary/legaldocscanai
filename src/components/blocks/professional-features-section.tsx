import { InView } from "@/components/ui/in-view";
import { Zap, Target, Shield } from "lucide-react";

export const ProfessionalFeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Analysis",
      description: "Get comprehensive contract analysis in under 60 seconds. No more hours of manual review.",
      iconBg: "bg-legal-gold/10",
      iconColor: "text-legal-gold"
    },
    {
      icon: Target,
      title: "Legally Accurate",
      description: "AI trained on 50+ million legal documents with verified citations and case law references.",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with attorney-client privilege protection and zero data retention.",
      iconBg: "bg-success/10",
      iconColor: "text-success"
    }
  ];

  return (
    <section className="bg-neutral-50 py-20">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Powerful Features Built for Legal Professionals
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience the future of legal document analysis with enterprise-grade security and accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <InView
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              >
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconBg} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </InView>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
};