import { Button } from "@/components/ui/button";
import { Check, Play, FileText, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const ProfessionalHeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-legal-navy via-legal-navy-light to-legal-navy overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3 space-y-8">
            <InView
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-neutral-300">
                  <span className="text-legal-gold">🔒</span>
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-neutral-300">
                  <span className="text-legal-gold">⚖️</span>
                  <span>ABA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-neutral-300">
                  <span className="text-legal-gold">🏛️</span>
                  <span className="hidden sm:inline">3,200+ Legal Professionals</span>
                  <span className="sm:hidden">3,200+ Users</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Review Legal Contracts in{" "}
                <span className="text-legal-gold">Minutes</span>, Not Hours
              </h1>

              {/* Subheadline */}
              <p className="text-xl lg:text-2xl text-neutral-300 leading-relaxed">
                AI-powered contract analysis that saves 2+ hours per document. Zero learning curve required.
              </p>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  "Instant contract analysis with legal citations",
                  "Seamless integration with Clio & LexisNexis",
                  "Bank-level security with zero data retention"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-neutral-200 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-legal-gold hover:bg-legal-gold-light text-legal-navy font-semibold px-8 py-4 text-lg rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                    onClick={() => navigate("/auth")}
                  >
                    Start Free 14-Day Trial
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-lg backdrop-blur-sm"
                    onClick={() => navigate("/features")}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>
                <p className="text-neutral-400 text-center sm:text-left">
                  No credit card required • Cancel anytime
                </p>
              </div>

              {/* Social Proof Counter */}
              <div className="flex items-center space-x-2 text-neutral-400">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm">Document #4,358 analyzed today</span>
              </div>
            </InView>
          </div>

          {/* Right Column - 40% */}
          <div className="lg:col-span-2">
            <InView
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative">
                {/* Product Demo Mockup */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
                  {/* Upload Area */}
                  <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-xl p-8 text-center mb-6">
                    <FileText className="w-12 h-12 text-legal-gold mx-auto mb-4" />
                    <p className="text-white text-lg font-medium mb-2">Drop your contract here</p>
                    <p className="text-neutral-400 text-sm">PDF, DOC, or image files supported</p>
                  </div>

                  {/* Processing Indicator */}
                  <div className="bg-success/20 border border-success/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                      <span className="text-success font-medium">Analysis completed in 43 seconds</span>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-legal-gold" />
                        <span className="text-white font-medium">Key Risk Areas</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-legal-gold/20 rounded px-3 py-1 text-sm text-legal-gold">Termination clause - High risk</div>
                        <div className="bg-yellow-500/20 rounded px-3 py-1 text-sm text-yellow-400">Payment terms - Medium risk</div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-legal-gold" />
                        <span className="text-white font-medium">Time Saved</span>
                      </div>
                      <p className="text-2xl font-bold text-legal-gold">2.3 hours</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-legal-gold text-legal-navy px-4 py-2 rounded-full font-bold text-sm animate-bounce">
                  AI Powered
                </div>
              </div>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
};