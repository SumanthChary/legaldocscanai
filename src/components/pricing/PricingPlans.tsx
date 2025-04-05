
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
                {feature.includes("beta") ? (
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <PricingButton plan={plan} />
        </div>
      ))}
    </div>
  );
};
