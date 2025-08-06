import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinalCtaSection = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Urgency Element */}
          <div className="inline-flex items-center gap-2 bg-gold-400/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gold-400 font-medium">
              127 legal professionals joined this week
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Contract Review Process?
          </h2>
          
          <p className="text-lg md:text-xl text-navy-300 mb-8 max-w-2xl mx-auto">
            Join 3,200+ legal professionals already saving hours with LegalDeep AI. 
            Your next contract review could take minutes instead of hours.
          </p>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-gold-400" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">Save 2.3 Hours</div>
                <div className="text-sm text-navy-400">Per contract analysis</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gold-400" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">$920 Recovered</div>
                <div className="text-sm text-navy-400">In billable time per contract</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-gold-400" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">100% Secure</div>
                <div className="text-sm text-navy-400">Zero data retention policy</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8 py-4 text-lg h-auto"
              onClick={() => navigate("/auth")}
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-navy-900 px-8 py-4 text-lg h-auto"
              onClick={() => navigate("/demo")}
            >
              Schedule Live Demo
            </Button>
          </div>

          {/* Risk Reversal */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gold-400">
              100% Risk-Free Guarantee
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-navy-300">No credit card required for trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-navy-300">Cancel anytime with one click</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-navy-300">100% money-back if not satisfied</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-navy-300">Your documents never stored</span>
              </div>
            </div>
          </div>

          {/* Final Guarantee */}
          <p className="text-navy-400 text-sm">
            <strong className="text-gold-400">Our Promise:</strong> If LegalDeep AI doesn't save you at least 2 hours 
            on your first contract analysis, we'll refund your money and send you a $50 Starbucks gift card for your time.
          </p>
        </div>
      </div>
    </div>
  );
};