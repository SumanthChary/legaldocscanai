
import { InView } from "@/components/ui/in-view";
import { Upload, Brain, Download, Check } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Document",
      description: "Simply drag and drop your legal document or browse to select it from your device.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our advanced AI analyzes your document, extracting key insights and important clauses.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Download,
      title: "Get Summary",
      description: "Receive a comprehensive summary with highlighted key points and risk assessments.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Check,
      title: "Take Action",
      description: "Use the insights to make informed decisions and streamline your legal workflow.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
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
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your legal document workflow in just four simple steps
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${step.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -translate-x-8"></div>
                )}
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};
