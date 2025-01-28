import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "For Individuals/Small Users",
      features: [
        "Summarize up to 50 documents/month",
        "Basic clause and risk analysis",
        "Limited customization options",
        "Email support",
        "Integration with cloud storage"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "For Small to Mid-Size Firms",
      features: [
        "Summarize up to 500 documents/month",
        "Advanced clause analysis and risk detection",
        "Jurisdiction-specific insights",
        "Multi-user access (up to 5 team members)",
        "Real-time collaboration tools",
        "Priority email support"
      ]
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "For Large Firms and Enterprises",
      features: [
        "Unlimited document summarization",
        "AI fine-tuning for firm-specific needs",
        "Batch processing and advanced analytics",
        "Integration with legal software",
        "Dedicated account manager and 24/7 support",
        "On-premises or private cloud option"
      ]
    },
    {
      name: "Pay-Per-Document",
      price: "$10",
      period: "/document",
      description: "Flexible for Low-Volume Users",
      features: [
        "Full access to summarization tools",
        "Complete analysis features",
        "Pay as you go pricing",
        "No monthly commitment",
        "Discounted bundles available"
      ]
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you
            </p>
          </div>
          
          {/* Main Plans */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
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
                <Button
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
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