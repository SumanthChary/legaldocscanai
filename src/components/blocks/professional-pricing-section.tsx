import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { InView } from "@/components/ui/in-view";
import { useNavigate } from "react-router-dom";

export const ProfessionalPricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "99",
      billing: "per month",
      description: "Perfect for solo practitioners",
      features: [
        "50 document analyses/month",
        "Basic integrations",
        "Email support",
        "Legal citation database"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "199",
      billing: "per month",
      description: "Most popular for small firms",
      features: [
        "200 document analyses/month",
        "Advanced integrations",
        "Priority support",
        "Custom workflows",
        "Team collaboration"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "399",
      billing: "per month",
      description: "For large firms and departments",
      features: [
        "Unlimited analyses",
        "API access",
        "Dedicated support",
        "Custom training",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <InView
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Start with our 14-day free trial. No credit card required.
            </p>
            <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
              <span>🛡️</span>
              <span>100% Money-Back Guarantee</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <InView
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              >
                <div className={`relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-legal-gold transform scale-105' 
                    : 'border border-neutral-200'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-legal-gold text-legal-navy px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>MOST POPULAR</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                    <p className="text-text-secondary mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-4xl font-bold text-text-primary">${plan.price}</span>
                      <span className="text-text-secondary ml-2">{plan.billing}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-success rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? 'bg-legal-gold hover:bg-legal-gold-light text-legal-navy'
                        : 'bg-legal-navy hover:bg-legal-navy-light text-white'
                    }`}
                    onClick={() => navigate(plan.cta === "Contact Sales" ? "/contact" : "/auth")}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </InView>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-text-secondary">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </InView>
      </div>
    </section>
  );
};