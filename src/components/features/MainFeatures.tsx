
import React from "react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ElementType;
  details: string[];
}

interface MainFeaturesProps {
  features: FeatureProps[];
}

export const MainFeatures = ({ features }: MainFeaturesProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {features.map((feature) => (
        <div 
          key={feature.title}
          className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:border-blue-500 transition-all"
        >
          <feature.icon className="h-12 w-12 text-blue-500 mb-6" />
          <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
          <p className="text-gray-600 mb-6">{feature.description}</p>
          <ul className="space-y-3">
            {feature.details.map((detail) => (
              <li key={detail} className="text-gray-600 flex items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
