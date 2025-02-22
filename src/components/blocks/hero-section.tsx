import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoVideo } from "./demo-video";

interface HeroProps {
  benefits: string[];
}

export const HeroSection = ({ benefits }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              Transform Legal Documents with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Streamline your legal workflow with our advanced AI technology. Analyze, summarize, and extract insights from complex legal documents in minutes.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8"
                onClick={() => navigate("/dashboard")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8"
                onClick={() => navigate("/document-analysis")}
              >
                Learn More
              </Button>
            </div>
            <div className="pt-6">
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <Check className="h-5 w-5 text-success" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative lg:scale-110">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl transform rotate-3"></div>
            <div className="relative transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <DemoVideo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
