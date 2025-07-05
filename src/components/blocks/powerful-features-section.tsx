
import { InView } from "@/components/ui/in-view";
import { FileText, Brain, Shield, Clock, Search, Users } from "lucide-react";

export const PowerfulFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Powered by state-of-the-art language models for accurate document understanding"
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDFs, Word documents, and other legal file formats seamlessly"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with GDPR, HIPAA, and SOC 2 standards"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in minutes, not hours of manual review"
    },
    {
      icon: Search,
      title: "Smart Insights",
      description: "Identify key clauses, risks, and opportunities with intelligent highlighting"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share analyses and collaborate with your team in real-time"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your legal document workflow
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group p-6 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-white">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};
