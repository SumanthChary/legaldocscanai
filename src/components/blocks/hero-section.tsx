
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoVideo } from "./demo-video";
import { InView } from "@/components/ui/in-view";

interface HeroProps {
  benefits: string[];
}

export const HeroSection = ({ benefits }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen flex items-center">
      {/* Sophisticated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 md:w-80 md:h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/3 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-br from-cyan-300/10 to-blue-500/10 rounded-full filter blur-2xl"></div>
        <div className="absolute top-1/6 right-1/3 w-24 h-24 md:w-48 md:h-48 bg-gradient-to-br from-indigo-300/15 to-purple-400/15 rounded-full filter blur-2xl"></div>
      </div>
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <InView
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="space-y-4 md:space-y-6">
                {/* Premium badge */}
                <div className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                  <span className="text-xs md:text-sm font-medium text-blue-700">AI-Powered Legal Intelligence</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Transform Legal
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Documents with AI
                  </span>
                </h1>
              </div>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Streamline your legal workflow with advanced AI technology. Analyze, summarize, and extract insights from complex legal documents in minutes, not hours.
              </p>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  size="lg"
                  className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 w-full sm:w-auto"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto"
                  onClick={() => navigate("/documentation")}
                >
                  Watch Demo
                </Button>
              </div>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="pt-6 md:pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <Check className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
                      </div>
                      <span className="text-sm md:text-base text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </InView>
          </div>
          
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="relative">
              <DemoVideo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
