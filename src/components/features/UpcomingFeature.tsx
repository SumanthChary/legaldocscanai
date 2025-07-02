
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

  return (
    <div className={isPreview ? "hover:shadow-sm transition-shadow" : ""}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[status]} whitespace-nowrap flex-shrink-0 self-start`}>
            {statusLabels[status]}
          </span>
        </div>
      </div>

      {isPreview ? (
        <p className="text-sm text-muted-foreground mt-4">
          More details available for beta program participants.
        </p>
      ) : (
        <>
          <h4 className="text-sm font-medium mb-3 mt-4">Key Benefits:</h4>
          <ul className="space-y-2">
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
