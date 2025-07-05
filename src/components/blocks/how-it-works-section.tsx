
import { InView } from "@/components/ui/in-view";
import { Upload, Brain, FileCheck, Sparkles } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Document",
      description: "Simply drag and drop or select your legal document. We support PDFs, Word docs, and more.",
      color: "from-blue-500 to-indigo-600",
      number: "01"
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Our advanced AI analyzes your document, extracting key insights and understanding context.",
      color: "from-purple-500 to-violet-600",
      number: "02"
    },
    {
      icon: FileCheck,
      title: "Intelligent Summary",
      description: "Get a comprehensive summary with highlighted key points, risks, and important clauses.",
      color: "from-emerald-500 to-teal-600",
      number: "03"
    },
    {
      icon: Sparkles,
      title: "Take Action",
      description: "Use the insights to make informed decisions and streamline your legal workflow efficiently.",
      color: "from-orange-500 to-red-500",
      number: "04"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
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

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <InView
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="relative text-center group">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-lg font-bold text-gray-400 group-hover:border-purple-300 group-hover:text-purple-600 transition-all duration-300">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r ${step.color} text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
