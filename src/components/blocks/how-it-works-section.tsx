import { InView } from "@/components/ui/in-view";
import { SkeumorphicIcon } from "@/components/ui/skeumorphic-icon";
import { Upload, Cpu, FileText, CheckCircle, ArrowRight } from "lucide-react";
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

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <InView 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }} 
                transition={{
                  duration: 0.6,
                  delay: index * 0.1
                }}
              >
                <div className="text-center group">
                  {/* Clean icon without background */}
                  <div className="mb-6">
                    <SkeumorphicIcon 
                      icon={step.icon} 
                      variant={step.variant}
                      size="lg"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-editorial font-medium text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 font-editorial font-light leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </InView>
              
              {/* Arrow between steps - only show on desktop and not after last step */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-10 -right-6 text-gray-400 z-10">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>;
};