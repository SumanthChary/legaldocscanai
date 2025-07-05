
import { InView } from "@/components/ui/in-view";
import { Upload, Brain, FileCheck, Sparkles } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Document",
      description: "Drag and drop your legal document or select from your device"
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Advanced AI analyzes and extracts key insights from your document"
    },
    {
      icon: FileCheck,
      title: "Get Summary",
      description: "Receive comprehensive analysis with highlighted key points"
    },
    {
      icon: Sparkles,
      title: "Take Action",
      description: "Use insights to make informed decisions quickly"
    }
  ];

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-editorial font-normal text-gray-900 mb-4 md:mb-6">
              How It Works
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-editorial font-light">
              Transform your legal document workflow in four simple steps
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <InView
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="text-center group relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 transform translate-x-1/2 z-0"></div>
                )}
                
                <div className="relative z-10 mb-6 md:mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-105 transition-all duration-300 shadow-lg">
                    <step.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-lg md:text-xl font-editorial font-normal text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 font-editorial font-light leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
};
