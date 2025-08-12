import { InView } from "@/components/ui/in-view";
import { Upload, Cpu, FileText, CheckCircle } from "lucide-react";
export const HowItWorksSection = () => {
  const steps = [{
    icon: Upload,
    title: "Upload in Seconds",
    description: "Drop your file and get started instantly—no setup."
  }, {
    icon: Cpu,
    title: "Analyze for Answers",
    description: "Our engine surfaces risks, deadlines, and must-know clauses."
  }, {
    icon: FileText,
    title: "Get Actionable Summary",
    description: "Clear next steps and highlights—not technical fluff."
  }, {
    icon: CheckCircle,
    title: "Act with Confidence",
    description: "Share, export, or proceed—reduce revisions and rework."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {steps.map((step, index) => <InView key={index} variants={{
          hidden: {
            opacity: 0,
            y: 20
          },
          visible: {
            opacity: 1,
            y: 0
          }
        }} transition={{
          duration: 0.6,
          delay: index * 0.1
        }}>
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center mx-auto group-hover:shadow-xl transition-all duration-300">
                  <step.icon className="w-7 h-7 md:w-8 md:h-8 text-blue-600" strokeWidth={1.5} />
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-editorial font-light text-gray-900 tracking-tight">
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