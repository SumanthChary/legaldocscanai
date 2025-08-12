import { InView } from "@/components/ui/in-view";
import { FileText, Cpu, Shield, Clock, Search, Users } from "lucide-react";
export const PowerfulFeaturesSection = () => {
  const features = [{
    icon: Search,
    title: "Risk & Clause Detection",
    description: "Spot hidden risks, obligations, and renewal traps before they cost you."
  }, {
    icon: Clock,
    title: "90% Faster Reviews",
    description: "Ship decisions in minutes and reclaim billable hours."
  }, {
    icon: FileText,
    title: "One‑Click Summaries",
    description: "Export clean briefs your clients actually understand."
  }, {
    icon: Shield,
    title: "Privacy by Default",
    description: "Your documents stay protected with enterprise‑grade controls."
  }, {
    icon: Users,
    title: "Collaboration",
    description: "Assign, comment, and align as a team.",
    comingSoon: true
  }, {
    icon: Cpu,
    title: "Cloud Integrations",
    description: "Connect with your drive and DMS.",
    comingSoon: true
  }];
  return <section className="py-20 md:py-28 lg:py-32 bg-white">
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
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-editorial font-light text-gray-900 mb-6 md:mb-8 tracking-tight">Powerful Features for Legal Professionals 🎓</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-editorial font-light leading-relaxed">
              Everything you need to transform your legal document workflow
            </p>
          </div>
        </InView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => <InView key={index} variants={{
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
              <div className="group p-8 md:p-10 rounded-2xl bg-gradient-to-br from-gray-50/50 to-white border border-gray-100 hover:border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300">
                  <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl md:text-2xl font-editorial font-light text-gray-900 tracking-tight">
                    {feature.title}
                  </h3>
                  {'comingSoon' in feature && (feature as any).comingSoon && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">Coming Soon</span>}
                </div>
                <p className="text-gray-600 text-base md:text-lg font-editorial font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </InView>)}
        </div>
      </div>
    </section>;
};