
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { DocumentGallery } from "@/components/DocumentGallery";
import { InsightCards } from "./InsightCards";

type ContentTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userId: string;
};

export const ContentTabs = ({ activeTab, setActiveTab, userId }: ContentTabsProps) => {
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
        <InsightCards />
      </TabsContent>
    </Tabs>
  );
};
