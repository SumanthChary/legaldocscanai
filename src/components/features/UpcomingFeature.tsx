
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
    <div className={isPreview ? "hover:shadow-md transition-shadow" : ""}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      {isPreview ? (
        <p className="text-sm text-muted-foreground mt-4">
          More details available in our beta program or for enterprise customers.
        </p>
      ) : (
        <>
          <h4 className="text-sm font-medium mb-2 mt-4">How It Works:</h4>
          <ul className="space-y-2">
            {infoList.map((info, index) => (
              <li key={index} className="flex items-start text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
