
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
    status: "available" | "coming-soon" | "beta";
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
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
        <p className="text-base sm:text-lg text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
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
