
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-primary text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Legal Document Workflow?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of legal professionals who trust our AI-powered solution
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="text-lg px-8 bg-white text-primary hover:bg-white/90"
          onClick={() => navigate("/dashboard")}
        >
          Start Free Trial
          <Users className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
