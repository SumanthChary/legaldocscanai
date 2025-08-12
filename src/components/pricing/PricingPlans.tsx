
import { useState } from "react";
import { PricingButton } from "./PricingButton";
import { Check, Sparkles } from "lucide-react";

interface PlanProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  originalPrice?: string;
}

interface PricingPlansProps {
  plans: PlanProps[];
  isAnnual: boolean;
}

export const PricingPlans = ({ plans, isAnnual }: PricingPlansProps) => {
  return (
    <div className="px-4 mb-12 md:mb-16">
      {/* Responsive grid that adapts to number of plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-xl shadow-lg p-6 lg:p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
              ${plan.highlight 
                ? 'border-blue-500 shadow-blue-100 ring-2 ring-blue-100' 
                : 'border-gray-200 hover:border-gray-300'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
                  ⭐ Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl lg:text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
              <div className="flex items-baseline justify-center mb-2">
                {plan.price !== "0" && <span className="text-2xl text-gray-600">$</span>}
                <span className="text-4xl lg:text-5xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-1">{plan.period}</span>
              </div>
              {plan.price !== "0" && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium mb-3">
                  🔥 Limited-time 40% OFF
                </div>
              )}
              <p className="text-gray-600 mb-6">{plan.description}</p>
            </div>
            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900 text-lg">What's included:</h4>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start text-gray-700">
                    {feature.includes("beta") ? (
                      <Sparkles className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    )}
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <PricingButton plan={plan} />
          </div>
        ))}
      </div>
    </div>
  );
};
