
import { InView } from "@/components/ui/in-view";
import { FileText, Brain, Shield, Clock, Search, Users } from "lucide-react";

export const PowerfulFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Powered by state-of-the-art language models for accurate document understanding",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDFs, Word documents, and other legal file formats seamlessly",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with GDPR, HIPAA, and SOC 2 standards",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in minutes, not hours of manual review",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Search,
      title: "Smart Insights",
      description: "Identify key clauses, risks, and opportunities with intelligent highlighting",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share analyses and collaborate with your team in real-time",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
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
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
