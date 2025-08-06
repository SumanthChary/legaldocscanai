import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, CheckCircle2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const ProfessionalHero = () => {
  const navigate = useNavigate();
  const [savings, setSavings] = useState({ hours: 2, rate: 400 });
  
  const calculateSavings = () => {
    const monthlySavings = savings.hours * savings.rate * 20; // 20 working days
    const yearlySavings = monthlySavings * 12;
    return { monthly: monthlySavings, yearly: yearlySavings };
  };

  const { monthly, yearly } = calculateSavings();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gold-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)]">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-gold-400" />
                SOC 2 Certified
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs md:text-sm">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-gold-400" />
                HIPAA Compliant
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Review Legal Contracts in
                <span className="block text-gold-400">12 Minutes, Not 2 Hours</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-navy-200 font-medium">
                Save 2.3 hours per contract = $920 in billable time recovered
              </p>
              
              <p className="text-base md:text-lg text-navy-300 max-w-2xl leading-relaxed">
                AI-powered contract analysis with legal citations. Used by 3,200+ attorneys at top firms. Zero learning curve, immediate ROI.
              </p>
            </div>

            {/* ROI Calculator */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gold-400">Your Potential Savings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-navy-300 mb-2">Hours saved per contract</label>
                  <input 
                    type="number" 
                    value={savings.hours}
                    onChange={(e) => setSavings({...savings, hours: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="0.5" 
                    max="10" 
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-sm text-navy-300 mb-2">Hourly rate ($)</label>
                  <input 
                    type="number" 
                    value={savings.rate}
                    onChange={(e) => setSavings({...savings, rate: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    min="100" 
                    max="1000" 
                    step="50"
                  />
                </div>
              </div>
              <div className="mt-4 p-3 bg-gold-400/10 rounded-lg border border-gold-400/20">
                <div className="flex justify-between items-center text-sm">
                  <span>Monthly savings:</span>
                  <span className="font-bold text-gold-400">${monthly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span>Annual savings:</span>
                  <span className="font-bold text-gold-400">${yearly.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Instant contract risk analysis",
                "Legal citations & case law",
                "Seamless Clio & LexisNexis integration", 
                "Zero data retention policy"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <span className="text-sm md:text-base text-navy-200">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8 py-3 text-base md:text-lg h-auto"
                onClick={() => navigate("/auth")}
              >
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-3 text-base md:text-lg h-auto"
                onClick={() => navigate("/demo")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Demo
              </Button>
            </div>

            <p className="text-sm text-navy-400">
              No credit card required • 100% money-back guarantee • Cancel anytime
            </p>
          </div>

          {/* Right Column - Demo Preview */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="text-xs text-navy-300 mb-2">Drop contract here</div>
                    <div className="h-20 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-navy-400">contract.pdf</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-navy-300">Analysis completed in 43 seconds</span>
                    </div>
                    <div className="bg-gold-400/20 rounded-lg p-3">
                      <div className="text-xs font-medium text-gold-400 mb-1">Key Findings:</div>
                      <div className="text-xs text-navy-300">
                        • 3 potential liability clauses identified<br/>
                        • Termination terms favor counterparty<br/>
                        • Indemnification scope overly broad
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Live Usage Counter */}
              <div className="absolute -bottom-4 -left-4 bg-gold-500 text-navy-900 px-4 py-2 rounded-lg text-sm font-semibold">
                Document #4,847 analyzed today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};