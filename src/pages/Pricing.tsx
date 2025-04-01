import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { PricingButton } from "@/components/pricing/PricingButton";

const Pricing = () => {
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
        "Advanced clause analysis and risk detection",
        "Jurisdiction-specific insights",
        "Multi-user access (up to 5 team members)",
        "Real-time collaboration tools",
        "Priority email support"
      ],
      highlight: true,
      popular: true
    },
    {
      name: "Enterprise",
      price: "399",
      period: "/month",
      description: "For Large Firms and Enterprises",
      features: [
        "Unlimited document summarization",
        "AI fine-tuning for firm-specific needs",
        "Batch processing and advanced analytics",
        "Integration with legal software",
        "Dedicated account manager and 24/7 support",
        "On-premises or private cloud option"
      ],
      highlight: false
    },
    {
      name: "Pay-Per-Document",
      price: "10",
      period: "/document",
      description: "Flexible for Low-Volume Users",
      features: [
        "Full access to summarization tools",
        "Complete analysis features",
        "Pay as you go pricing",
        "No monthly commitment",
        "Discounted bundles available"
      ],
      highlight: false
    }
  ];

  const addOns = [
    {
      name: "Additional Users",
      price: "$20/user/month",
      description: "Beyond plan limit"
    },
    {
      name: "API Access",
      price: "$199/month",
      description: "Plus usage-based pricing"
    },
    {
      name: "Custom Model Training",
      price: "From $1,000",
      description: "One-time setup fee"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start with 3 Free Documents
            </h1>
            <p className="text-xl text-gray-600">
              Try our document analyzer for free, then choose the plan that's right for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-lg shadow-lg p-8 border-2 transition-all transform hover:scale-105 
                  ${plan.highlight 
                    ? 'border-blue-500 shadow-blue-100' 
                    : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  {plan.price !== "0" && <span>$</span>}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <PricingButton plan={plan} />
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Optional Add-ons</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {addOns.map((addon) => (
                <div
                  key={addon.name}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                >
                  <h3 className="text-lg font-semibold mb-2">{addon.name}</h3>
                  <div className="text-2xl font-bold mb-2">{addon.price}</div>
                  <p className="text-gray-600">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
