import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TransparentPricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Solo Practitioner",
      price: 99,
      description: "Perfect for individual attorneys",
      popular: false,
      features: [
        "50 document analyses/month",
        "Basic risk assessment",
        "Email support",
        "Legal citation database",
        "Mobile app access"
      ]
    },
    {
      name: "Small Firm",
      price: 199, 
      description: "Most popular for 2-10 attorneys",
      popular: true,
      features: [
        "200 document analyses/month",
        "Advanced risk assessment",
        "Priority phone support",
        "Team collaboration tools",
        "Clio & LexisNexis integration",
        "Custom clause libraries",
        "Analytics dashboard"
      ]
    },
    {
      name: "Enterprise",
      price: 399,
      description: "For large firms & departments", 
      popular: false,
      features: [
        "Unlimited document analyses",
        "AI model customization",
        "Dedicated success manager",
        "SSO & advanced security",
        "API access & bulk processing",
        "Custom training & onboarding",
        "Priority feature requests"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-navy-50 to-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-4">
            Transparent Pricing That Pays for Itself
          </h2>
          <p className="text-lg md:text-xl text-navy-600 mb-6">
            Choose your plan and start saving hours immediately. All plans include our 14-day free trial.
          </p>
          <div className="inline-flex items-center gap-2 bg-gold-100 px-4 py-2 rounded-full">
            <Star className="h-4 w-4 text-gold-600" />
            <span className="text-sm font-medium text-gold-800">
              Average ROI: 400% in first month
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-gold-400 ring-4 ring-gold-100 scale-105' 
                  : 'border-navy-200 hover:border-navy-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gold-500 text-navy-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-navy-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-navy-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-navy-900">
                    ${plan.price}
                  </span>
                  <span className="text-navy-600">/month</span>
                </div>
                <div className="text-sm text-navy-500">
                  Saves ${(plan.price * 4).toLocaleString()}+ monthly in billable time
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 text-base font-semibold ${
                  plan.popular
                    ? 'bg-gold-500 hover:bg-gold-600 text-navy-900'
                    : 'bg-navy-900 hover:bg-navy-800 text-white'
                }`}
                onClick={() => navigate("/auth")}
              >
                Start Free 14-Day Trial
              </Button>
            </div>
          ))}
        </div>

        {/* Risk Reversal */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-gold-600" />
              </div>
              <div className="text-sm font-medium text-navy-900">No Credit Card Required</div>
              <div className="text-xs text-navy-600 text-center">Start your trial instantly</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-gold-600" />
              </div>
              <div className="text-sm font-medium text-navy-900">100% Money-Back Guarantee</div>
              <div className="text-xs text-navy-600 text-center">If you don't save 2+ hours on your first contract</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-gold-600" />
              </div>
              <div className="text-sm font-medium text-navy-900">Cancel Anytime</div>
              <div className="text-xs text-navy-600 text-center">One-click cancellation</div>
            </div>
          </div>
          
          <div className="bg-navy-900 text-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Enterprise & Custom Solutions</h3>
            <p className="text-navy-300 mb-4">
              Need unlimited processing, custom AI training, or white-label solutions? 
            </p>
            <Button 
              variant="outline" 
              className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-navy-900"
              onClick={() => navigate("/contact")}
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};