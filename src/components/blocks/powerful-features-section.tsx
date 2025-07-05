
import { InView } from "@/components/ui/in-view";
import { FileText, Brain, Shield, Clock, Search, Users } from "lucide-react";

export const PowerfulFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Analysis",
      description: "Powered by state-of-the-art language models for accurate document understanding",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Process PDFs, Word documents, and other legal file formats seamlessly",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with GDPR, HIPAA, and SOC 2 standards",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in minutes, not hours of manual review",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Search,
      title: "Smart Insights",
      description: "Identify key clauses, risks, and opportunities with intelligent highlighting",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share analyses and collaborate with your team in real-time",
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50"
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
              <div className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
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
