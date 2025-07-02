
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingFeature } from "./UpcomingFeature";
import { Eye } from "lucide-react";

interface FeatureHighlightProps {
  title: string;
  description: string;
  features: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
    status: "available" | "coming-soon" | "beta";
    infoList: string[];
  }>;
  showEnterpriseTip?: boolean;
}

export const FeatureHighlight = ({
  title,
  description,
  features,
  showEnterpriseTip = false
}: FeatureHighlightProps) => {
  return (
    <>
      <div className="max-w-4xl mx-auto mb-8 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{title}</h2>
          {showEnterpriseTip && (
            <div className="relative group">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 cursor-pointer hover:text-blue-700" />
              <div className="absolute -top-10 right-0 bg-black text-white text-xs p-2 rounded w-32 sm:w-40 opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                Enterprise customers see our full roadmap
              </div>
            </div>
          )}
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="h-full border border-gray-200 hover:border-gray-300 transition-colors">
            <CardHeader className="pb-3 p-4 sm:p-6">
              <UpcomingFeature 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                infoList={feature.infoList}
              />
            </CardHeader>
            <CardContent className="pt-0"></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
