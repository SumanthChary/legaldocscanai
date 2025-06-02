
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Ready to Transform Your Legal Document Workflow?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of legal professionals who trust our AI-powered solution
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/dashboard")}
          >
            Start Free Trial
            <Users className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </InView>
      </div>
    </div>
  );
};
