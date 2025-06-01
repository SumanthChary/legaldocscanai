
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Clock, TrendingUp } from "lucide-react";
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
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-500/15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Secondary accent orbs */}
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-300/10 to-blue-500/10 rounded-full filter blur-2xl"></div>
        <div className="absolute top-1/6 right-1/3 w-48 h-48 bg-gradient-to-br from-indigo-300/15 to-purple-400/15 rounded-full filter blur-2xl"></div>
      </div>
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <InView
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="space-y-4">
                {/* Enhanced premium badge with urgency */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Join 10,000+ Legal Professionals</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Save 75% Time on
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Legal Document Review
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
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Transform complex legal documents into clear, actionable insights in minutes. Trusted by industry leaders with <span className="font-semibold text-gray-800">95% accuracy</span> and <span className="font-semibold text-gray-800">enterprise-grade security</span>.
              </p>
            </InView>

            {/* Value proposition with micro-commitments */}
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="flex items-center gap-6 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Start in 60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Immediate ROI</span>
                </div>
              </div>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group"
                  onClick={() => navigate("/dashboard")}
                >
                  <span className="relative z-10">Start Free Trial - No Credit Card</span>
                  <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 h-auto border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => navigate("/documentation")}
                >
                  Watch 2-Min Demo
                </Button>
              </div>
            </InView>

            {/* Risk reversal */}
            <InView
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>30-day money-back guarantee • Cancel anytime • SOC 2 certified</span>
              </div>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/50 hover:bg-white/80 transition-all duration-300 shadow-sm"
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-800 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </InView>
          </div>
          
          <div className="lg:col-span-7">
            <div className="relative">
              <DemoVideo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
