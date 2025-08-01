import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Scale, Lock, Building, Clock, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { useState, useEffect } from "react";
// Animated demo mockup component
const DemoMockup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [processingTime, setProcessingTime] = useState(47);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setProcessingTime(prev => Math.floor(Math.random() * 20) + 35);
    }, 5000);
    return () => clearInterval(timeInterval);
  }, []);

  const steps = [
    { icon: "📄", text: "Document Upload", color: "bg-blue-500" },
    { icon: "🔄", text: "AI Processing", color: "bg-yellow-500" },
    { icon: "✅", text: "Results Ready", color: "bg-green-500" }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col items-center space-y-2 transition-all duration-500 ${
              index <= currentStep ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                index <= currentStep ? step.color : 'bg-gray-400'
              } transition-all duration-500`}>
                {step.icon}
              </div>
              <span className="text-white/80 text-sm font-medium">{step.text}</span>
            </div>
          ))}
        </div>

        {/* Sample Document Preview */}
        <div className="bg-white/95 rounded-lg p-4 text-gray-800">
          <div className="text-sm font-semibold mb-2">Contract_Analysis_Sample.pdf</div>
          <div className="space-y-2 text-xs">
            <div className={`p-2 rounded ${currentStep >= 1 ? 'bg-yellow-100 border-l-4 border-yellow-500' : 'bg-gray-50'}`}>
              <span className="font-medium">Key Risk:</span> Unlimited liability clause detected
            </div>
            <div className={`p-2 rounded ${currentStep >= 2 ? 'bg-green-100 border-l-4 border-green-500' : 'bg-gray-50'}`}>
              <span className="font-medium">Recommendation:</span> Add liability cap of $1M
            </div>
            <div className={`p-2 rounded ${currentStep >= 2 ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}>
              <span className="font-medium">Citation:</span> Johnson v. Corp (2019) 234 F.3d 567
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis complete in {processingTime} seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Live counters component
const LiveCounters = () => {
  const [documentCount, setDocumentCount] = useState(4237);
  const [weeklyJoins, setWeeklyJoins] = useState(127);
  const [todayTrials, setTodayTrials] = useState(23);

  useEffect(() => {
    const interval = setInterval(() => {
      setDocumentCount(prev => prev + Math.floor(Math.random() * 2));
      if (Math.random() > 0.7) setWeeklyJoins(prev => prev + 1);
      if (Math.random() > 0.8) setTodayTrials(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
        <Scale className="h-4 w-4 text-[#d4af37]" />
        <span className="text-white/90 text-sm font-medium">ABA Compliant</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
        <Lock className="h-4 w-4 text-[#d4af37]" />
        <span className="text-white/90 text-sm font-medium">SOC 2 Certified</span>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
        <Building className="h-4 w-4 text-[#d4af37]" />
        <span className="text-white/90 text-sm font-medium">2,847+ Legal Professionals</span>
      </div>
    </div>
  );
};

interface HeroProps {
  benefits: string[];
}

export const HeroSection = ({ benefits }: HeroProps) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const keyBenefits = [
    "Legal accuracy guaranteed with citations",
    "Integrate with Clio, LexisNexis, Westlaw", 
    "Zero data retention policy"
  ];

  const additionalFeatures = [
    "Version control with attorney review workflow",
    "Multi-attorney collaborative editing",
    "Export to Westlaw, Bloomberg Law",
    "Audit trail of all AI suggestions"
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] min-h-screen flex items-center">
      {/* Navy gradient background with subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* 60/40 Split Layout */}
        <div className="grid lg:grid-cols-5 gap-8 xl:gap-16 items-center">
          {/* Left Side Copy - 60% */}
          <div className="lg:col-span-3 space-y-6">
            <InView variants={{
              hidden: { opacity: 0, x: -40 },
              visible: { opacity: 1, x: 0 }
            }} transition={{ duration: 0.8, delay: 0.2 }}>
              {/* Trust Badge Bar */}
              <LiveCounters />
              
              {/* H1 Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-editorial">
                Generate Contract Reviews in{" "}
                <span className="text-[#d4af37]">5 Minutes</span>
              </h1>
              
              {/* H2 Subheadline */}
              <h2 className="text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-6">
                Save 2+ Hours Per Document. No Training Required.
              </h2>
            </InView>

            <InView variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }} transition={{ duration: 0.8, delay: 0.4 }}>
              {/* Key Benefits with Progressive Disclosure */}
              <div className="space-y-3 mb-6">
                {keyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90 text-lg font-medium">{benefit}</span>
                  </div>
                ))}
                
                {/* Progressive Disclosure */}
                {showMore && additionalFeatures.map((feature, index) => (
                  <div key={`additional-${index}`} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90 text-lg font-medium">{feature}</span>
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowMore(!showMore)}
                  className="text-[#d4af37] hover:text-[#d4af37]/80 text-sm font-medium underline"
                >
                  {showMore ? 'Show less' : 'Learn more features'}
                </button>
              </div>
            </InView>

            <InView variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }} transition={{ duration: 0.8, delay: 0.6 }}>
              {/* CTA Button */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-[#10b981] hover:bg-[#10b981]/90 text-white font-semibold text-lg px-8 py-4 h-auto min-h-[44px] w-full sm:w-auto shadow-xl hover:shadow-2xl transition-all duration-300" 
                  onClick={() => navigate("/dashboard")}
                >
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                {/* Disclaimer */}
                <p className="text-white/70 text-sm">
                  No credit card required • Cancel anytime
                </p>
              </div>
            </InView>

            <InView variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }} transition={{ duration: 0.8, delay: 0.8 }}>
              {/* Enhanced Guarantee Messaging */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#d4af37] rounded-full flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">100% Money-Back Guarantee</span>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed pl-11">
                    If you don't save 2+ hours on your first document, full refund. 
                    Try risk-free for 14 days with full access, no limitations.
                  </p>
                  <div className="flex items-center gap-2 pl-11">
                    <Lock className="h-4 w-4 text-[#d4af37]" />
                    <span className="text-white/80 text-sm">Your documents never stored - Processed and deleted immediately</span>
                  </div>
                </div>
              </div>
            </InView>
          </div>
          
          {/* Right Side Demo - 40% */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <InView variants={{
              hidden: { opacity: 0, x: 40 },
              visible: { opacity: 1, x: 0 }
            }} transition={{ duration: 0.8, delay: 0.4 }}>
              <DemoMockup />
            </InView>
          </div>
        </div>

        {/* Bottom Section - Customer Logos & Testimonial */}
        <InView variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        }} transition={{ duration: 0.8, delay: 1.0 }}>
          <div className="mt-16 space-y-8">
            {/* Social Proof Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="text-white/90">
                <div className="text-2xl font-bold text-[#d4af37]">4,237</div>
                <div className="text-sm">Documents processed today</div>
              </div>
              <div className="text-white/90">
                <div className="text-2xl font-bold text-[#d4af37]">127</div>
                <div className="text-sm">Lawyers joined this week</div>
              </div>
              <div className="text-white/90">
                <div className="text-2xl font-bold text-[#d4af37]">2.3 hours</div>
                <div className="text-sm">Average time saved per contract</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah Martinez</div>
                  <div className="text-white/70 text-sm">Corporate Attorney, Martinez & Associates</div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#d4af37] fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-white/90 text-lg italic">
                "Reduced my contract review time by 75%. The AI catches risks I might have missed 
                and provides actual case law citations. It's like having a senior associate that never sleeps."
              </blockquote>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};