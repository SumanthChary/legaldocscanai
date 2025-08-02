import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { InView } from "@/components/ui/in-view";
import { useNavigate } from "react-router-dom";

export const FinalCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-legal-navy via-legal-navy-light to-legal-navy overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Transform Your Contract Review Process?
            </h2>
            <p className="text-xl md:text-2xl text-neutral-300 mb-12 leading-relaxed">
              Join 3,200+ legal professionals already saving hours with Legal Deep AI
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-legal-gold hover:bg-legal-gold-light text-legal-navy font-semibold px-8 py-4 text-lg rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/auth")}
              >
                Start Free 14-Day Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-lg backdrop-blur-sm"
                onClick={() => navigate("/contact")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-legal-gold font-semibold text-lg">
                🛡️ 100% Money-Back Guarantee • No Questions Asked
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-neutral-400 text-sm">
                <span>✓ No credit card required</span>
                <span>✓ Cancel anytime</span>
                <span>✓ Full access during trial</span>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-legal-gold mb-2">47,000+</div>
                <div className="text-neutral-400">Contracts Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-legal-gold mb-2">2.3h</div>
                <div className="text-neutral-400">Average Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-legal-gold mb-2">94%</div>
                <div className="text-neutral-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-legal-gold mb-2">3,200+</div>
                <div className="text-neutral-400">Active Users</div>
              </div>
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
};