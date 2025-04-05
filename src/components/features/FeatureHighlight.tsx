
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
      <div className="max-w-3xl mx-auto mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          {showEnterpriseTip && (
            <div className="relative">
              <Eye className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-700" />
              <div className="absolute -top-10 right-0 bg-black text-white text-xs p-2 rounded w-40 opacity-0 group-hover:opacity-100 pointer-events-none">
                Enterprise customers see our full roadmap
              </div>
            </div>
          )}
        </div>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <UpcomingFeature 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                infoList={feature.infoList}
              />
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
