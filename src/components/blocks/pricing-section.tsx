
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RedeemCodeModal } from "@/components/pricing/RedeemCodeModal";

export const PricingSection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "",
      description: "7-day free trial with limits",
      features: [
        "3 free document analyses",
        "Basic document summarization",
        "E-Signature requests (single signer, PDF only)",
        "Email support",
        "Standard processing time"
      ],
      highlight: false
    },
    {
      name: "Starter Plan",
      price: isAnnual ? "16" : "20",
      period: isAnnual ? "/month, billed annually" : "/month",
      description: "For Individual Users",
      features: [
        "Summarize up to 25 documents/month",
        "Basic clause analysis",
        "E-Signature requests (single signer, PDF only)",
        "Email support",
        "Standard processing time",
        "Basic document templates"
      ],
      highlight: false
    },
    {
      name: "Professional",
      price: isAnnual ? "79" : "99",
      period: isAnnual ? "/month, billed annually" : "/month",
      description: "For Small to Mid-Size Firms",
      features: [
        "Summarize up to 500 documents/month",
        "Advanced clause analysis",
        "E-Signature requests (single signer, PDF only)",
        "Risk detection",
        "Multi-user access (up to 5 users)",
        "Priority support"
      ],
      highlight: true,
      popular: true
    }
  ];

  const handleGetStarted = (plan: any) => {
    navigate("/payment", { 
      state: { 
        plan: {
          name: plan.name,
          price: plan.name === "Free" ? "0" : `$${plan.price}`,
          period: plan.period
        }
      }
    });
  };

  return (
    <div className="py-8 md:py-12 lg:py-16 xl:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-4 lg:mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6">
              Start with 3 free documents, then choose the plan that works best for you
            </p>
            <Button 
              onClick={() => setIsRedeemModalOpen(true)}
              variant="outline"
              size="default"
              className="flex items-center mx-auto"
            >
              <Ticket className="mr-1.5 h-3.5 w-3.5 md:mr-2 md:h-4 md:w-4" />
              Redeem a Promotion Code
            </Button>
          </div>

          <div className="flex justify-center items-center gap-2 md:gap-3 mb-6 md:mb-8 lg:mb-10">
            <span className={`text-sm md:text-base ${!isAnnual ? 'font-medium' : 'text-gray-600'}`}>Monthly</span>
            <Switch 
              id="landing-pricing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <span className={`text-sm md:text-base ${isAnnual ? 'font-medium' : 'text-gray-600'}`}>
              Annual <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded ml-1">Save 20%</span>
            </span>
          </div>
        </InView>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <InView
              key={plan.name}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full transition-all duration-300 hover:scale-105 ${
                  plan.highlight 
                    ? 'border-accent shadow-lg shadow-accent/20' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 md:-top-3 lg:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-2 py-1 md:px-3 md:py-1 lg:px-4 lg:py-1 rounded-full text-xs md:text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 px-3 md:px-4 lg:px-6">
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-3 md:mb-4">
                    {plan.price !== "0" && <span className="text-base md:text-lg lg:text-xl">$</span>}
                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1 text-xs md:text-sm lg:text-base">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-4 md:mb-6 text-xs md:text-sm lg:text-base">{plan.description}</p>
                  <ul className="space-y-2 md:space-y-3 lg:space-y-4 mb-4 md:mb-6 lg:mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600 text-xs md:text-sm lg:text-base">
                        <Check className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 text-success mr-1.5 md:mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-auto"
                    size="default"
                    variant={plan.name === "Free" ? "outline" : "default"}
                    onClick={() => handleGetStarted(plan)}
                  >
                    {plan.name === "Free" ? "Start Free Trial" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            </InView>
          ))}
        </div>
        
        <div className="text-center mt-6 md:mt-8 lg:mt-10">
          <Button 
            variant="link"
            className="text-primary font-medium text-sm md:text-base"
            onClick={() => navigate("/pricing")}
          >
            View all pricing options
          </Button>
        </div>
      </div>
      
      <RedeemCodeModal 
        isOpen={isRedeemModalOpen} 
        onClose={() => setIsRedeemModalOpen(false)} 
      />
    </div>
  );
};
