
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { DocumentGallery } from "@/components/DocumentGallery";
import { Card } from "@/components/ui/card";
import { Clock, Target, TrendingUp, Zap } from "lucide-react";

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
        {/* Enhanced Insights Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Insights</h2>
          {/* Dynamically loaded insights for the user */}
          {/* @ts-expect-error: userId is passed from Dashboard */}
          <InsightsSection userId={userId} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
