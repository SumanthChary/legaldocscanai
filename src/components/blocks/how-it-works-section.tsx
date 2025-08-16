import { InView } from "@/components/ui/in-view";
import { SkeumorphicIcon } from "@/components/ui/skeumorphic-icon";
import { Upload, Cpu, FileText, CheckCircle } from "lucide-react";
export const HowItWorksSection = () => {
  const steps = [{
    icon: Upload,
    title: "Upload in Seconds",
    description: "Drop your file and get started instantly—no setup.",
    variant: "upload" as const,
    number: "01"
  }, {
    icon: Cpu,
    title: "Analyze for Answers",
    description: "Our engine surfaces risks, deadlines, and must-know clauses.",
    variant: "process" as const,
    number: "02"
  }, {
    icon: FileText,
    title: "Get Actionable Summary",
    description: "Clear next steps and highlights—not technical fluff.",
    variant: "result" as const,
    number: "03"
  }, {
    icon: CheckCircle,
    title: "Act with Confidence",
    description: "Share, export, or proceed—reduce revisions and rework.",
    variant: "action" as const,
    number: "04"
  }];
  return <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6
      }}>
          <div className="text-center mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">How it works 🚀 ?</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-editorial font-light leading-relaxed">
              Value at every step: faster reviews, clearer decisions
            </p>
          </div>
        </InView>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Connecting lines */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          
          {steps.map((step, index) => <InView key={index} variants={{
          hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1
          }
        }} transition={{
          duration: 0.8,
          delay: index * 0.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}>
              <div className="text-center group relative">
                {/* Step number badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center z-10">
                  <span className="text-white text-sm font-bold">{step.number}</span>
                </div>
                
                <div className="relative mb-8 pt-4">
                  {/* Subtle background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                  
                  {/* 3D Icon container */}
                  <div className="relative flex justify-center">
                    <SkeumorphicIcon 
                      icon={step.icon} 
                      variant={step.variant}
                      size="lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <h3 className="text-xl md:text-2xl font-editorial font-light text-gray-900 tracking-tight group-hover:text-blue-900 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-gray-600 font-editorial font-light leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            </InView>)}
        </div>
      </div>
    </section>;
};