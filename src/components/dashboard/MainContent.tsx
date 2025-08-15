
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { DocumentGallery } from "@/components/DocumentGallery";

import { Card } from "@/components/ui/card";
import { Clock, Target, TrendingUp, Zap } from "lucide-react";
import { EnhancedInsightsSection } from "@/components/dashboard/EnhancedInsightsSection";

type MainContentProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userId: string;
};

export const MainContent = ({ activeTab, setActiveTab, userId }: MainContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="documents">
        <DocumentGallery userId={userId} />
      </TabsContent>

      <TabsContent value="upload">
        <DocumentAnalysis />
      </TabsContent>

      <TabsContent value="insights">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Analytics & Insights
          </h2>
          <EnhancedInsightsSection userId={userId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
