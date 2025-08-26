
import { InView } from "@/components/ui/in-view";
import { Shield, Users, Award, Zap } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with international data protection standards"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Legal professionals and AI experts working together to deliver cutting-edge solutions"
    },
    {
      icon: Award,
      title: "Professional Development",
      description: "Built with insights from legal professionals and continuous improvement"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process documents in seconds with our advanced AI technology"
    }
  ];

  return (
    <div className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 }
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewOptions={{ margin: "0px 0px -100px 0px" }}
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6 md:mb-8">
              About LegalDeep AI
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
              LegalDeep AI is a professional-grade platform founded by Sumanth Chary to help legal professionals analyze documents more efficiently. We've built a robust solution trusted by legal practitioners worldwide.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-12">
              <strong>PROVEN RESULTS:</strong> Our platform has successfully processed thousands of documents for legal professionals, delivering consistent accuracy and reliability. We continuously enhance our capabilities based on real-world usage and professional feedback.
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </InView>
          ))}
        </div>

        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                To provide a reliable, professional-grade AI tool for legal document analysis that delivers consistent results and empowers legal professionals to work more efficiently. Trusted by solo practitioners, law firms, and legal departments worldwide.
              </p>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};
