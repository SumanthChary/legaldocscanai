
import React from "react";
import { CheckCircle } from "lucide-react";

interface UpcomingFeatureProps { 
  icon: React.ElementType;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "beta";
  infoList: string[];
  isPreview?: boolean;
}

export const UpcomingFeature = ({ 
  icon: Icon, 
  title, 
  description, 
  status, 
  infoList,
  isPreview = false
}: UpcomingFeatureProps) => {
  const statusColors = {
    "available": "bg-green-100 text-green-700",
    "coming-soon": "bg-amber-100 text-amber-700",
    "beta": "bg-blue-100 text-blue-700"
  };
  
  const statusLabels = {
    "available": "Available Now",
    "coming-soon": "Coming Soon",
    "beta": "Beta Access"
  };

  const iconColors = {
    "available": "text-green-600",
    "coming-soon": "text-amber-600", 
    "beta": "text-blue-600"
  };

  const backgroundColors = {
    "available": "bg-green-50",
    "coming-soon": "bg-amber-50",
    "beta": "bg-blue-50"
  };

  return (
    <div className={isPreview ? "hover:shadow-sm transition-shadow" : ""}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div className="flex gap-3 flex-1 min-w-0">
          <div className={`p-2 ${backgroundColors[status]} rounded-lg flex-shrink-0`}>
            <Icon className={`h-5 w-5 ${iconColors[status]}`} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[status]} whitespace-nowrap flex-shrink-0`}>
          {statusLabels[status]}
        </span>
      </div>

      {isPreview ? (
        <p className="text-sm text-muted-foreground mt-4 px-2">
          More details available for beta program participants.
        </p>
      ) : (
        <>
          <h4 className="text-sm font-medium mb-3 mt-4 px-2">Key Benefits:</h4>
          <ul className="space-y-2 px-2">
            {infoList.map((info, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span className="text-gray-700">{info}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
