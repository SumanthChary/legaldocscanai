
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UpcomingFeature } from "./UpcomingFeature";

interface PreviewFeaturesProps {
  title: string;
  description: string;
  features: Array<{
    icon: React.ElementType;
    title: string;
    description: string;
    status: "available" | "coming-soon" | "pro";
    infoList: string[];
  }>;
}

export const PreviewFeatures = ({
  title,
  description,
  features
}: PreviewFeaturesProps) => {
  return (
    <>
      <div className="max-w-4xl mx-auto mb-8 text-center px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="h-full border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-4 sm:p-6">
              <UpcomingFeature 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                status={feature.status}
                infoList={feature.infoList}
                isPreview={true}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
