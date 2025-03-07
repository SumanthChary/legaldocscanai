
import { useState } from "react";
import { UploadSection } from "./document-analysis/UploadSection";
import { AnalysesList } from "./document-analysis/AnalysesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DocumentAnalysis = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="analyses">Recent Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <UploadSection onSuccess={() => setActiveTab("analyses")} />
        </TabsContent>
        
        <TabsContent value="analyses" className="mt-6">
          <AnalysesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
