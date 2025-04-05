
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DemoVideo } from "./demo-video";
import { InView } from "@/components/ui/in-view";

interface HeroProps {
  benefits: string[];
}

export const HeroSection = ({ benefits }: HeroProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-accent/5">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <InView
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 }
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                Transform Legal Documents with AI
              </h1>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg md:text-xl text-gray-600">
                Streamline your legal workflow with our advanced AI technology. Analyze, summarize, and extract insights from complex legal documents in minutes.
              </p>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-8 shadow-lg hover:shadow-primary/25"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base md:text-lg px-6 md:px-8"
                  onClick={() => navigate("/documentation")}
                >
                  Learn More
                </Button>
              </div>
            </InView>
            
            <InView
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="pt-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
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
