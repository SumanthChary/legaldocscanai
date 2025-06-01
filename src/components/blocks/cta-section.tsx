
import { Users, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to 10X Your Legal 
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Document Efficiency?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ legal professionals who've transformed their practice. 
              <span className="font-semibold">Start free, upgrade when ready.</span>
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 opacity-80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">10,000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SOC 2 certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Setup in 60 seconds</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-10 py-5 h-auto bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 font-semibold group"
                onClick={() => navigate("/dashboard")}
              >
                Start Your Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-sm opacity-75">
                No credit card required • 3 free analyses • Upgrade anytime
              </p>
            </div>

            {/* Urgency element */}
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-md mx-auto">
              <p className="text-sm font-medium">
                <span className="text-yellow-300">Limited Time:</span> First 1,000 users get 50% off Pro plan for 6 months
              </p>
            </div>
          </div>
        </InView>
      </div>
    </div>
  );
};
