
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InView } from "@/components/ui/in-view";
import { Card, CardContent } from "@/components/ui/card";

export const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "0",
      period: "",
      description: "Try it out first",
      features: [
        "3 free document analyses",
        "Basic document summarization",
        "Email support",
        "Standard processing time"
      ],
      highlight: false
    },
    {
      name: "Basic",
      price: "20",
      period: "/month",
      description: "For Individual Users",
      features: [
        "Summarize up to 25 documents/month",
        "Basic clause analysis",
        "Email support",
        "Standard processing time",
        "Basic document templates"
      ],
      highlight: false
    },
    {
      name: "Professional",
      price: "99",
      period: "/month",
      description: "For Small to Mid-Size Firms",
      features: [
        "Summarize up to 500 documents/month",
        "Advanced clause analysis",
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
    <div className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with 3 free documents, then choose the plan that works best for you
            </p>
          </div>
        </InView>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="pt-8 pb-6 px-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    {plan.price !== "0" && <span>$</span>}
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <Check className="h-5 w-5 text-success mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-auto"
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
        
        <div className="text-center mt-10">
          <Button 
            variant="link"
            className="text-primary font-medium"
            onClick={() => navigate("/pricing")}
          >
            View all pricing options
          </Button>
        </div>
      </div>
    </div>
  );
};
