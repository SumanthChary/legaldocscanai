
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
}

interface PricingPlansProps {
  plans: PlanProps[];
  isAnnual: boolean;
}

export const PricingPlans = ({ plans, isAnnual }: PricingPlansProps) => {
  return (
    <div className="px-4 mb-12 md:mb-16">
      {/* Mobile: Stack all cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-lg shadow-lg p-4 md:p-6 lg:p-8 border-2 transition-all transform hover:scale-105 
              ${plan.highlight 
                ? 'border-blue-500 shadow-blue-100' 
                : 'border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-blue-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="text-lg md:text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="flex items-baseline mb-3 md:mb-4">
              {plan.price !== "0" && <span className="text-lg md:text-xl">$</span>}
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-600 ml-1 text-sm md:text-base">{plan.period}</span>
            </div>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{plan.description}</p>
            <ul className="space-y-2 md:space-y-3 lg:space-y-4 mb-6 md:mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-gray-600 text-sm md:text-base">
                  {feature.includes("beta") ? (
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
            <PricingButton plan={plan} />
          </div>
        ))}
      </div>
    </div>
  );
};
