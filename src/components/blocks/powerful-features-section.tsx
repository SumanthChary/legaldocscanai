
import { InView } from "@/components/ui/in-view";
import { FileText, Cpu, Shield, Clock, Search, Users } from "lucide-react";

export const PowerfulFeaturesSection = () => {
  const features = [
    {
      icon: Cpu,
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
    <section className="py-20 md:py-28 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-editorial font-light leading-relaxed">
              Everything you need to transform your legal document workflow
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="group p-8 md:p-10 rounded-2xl bg-gradient-to-br from-gray-50/50 to-white border border-gray-100 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-editorial font-light text-gray-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg font-editorial font-light leading-relaxed">
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
