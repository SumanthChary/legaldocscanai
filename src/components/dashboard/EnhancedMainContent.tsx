import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentAnalysis } from "@/components/DocumentAnalysis";
import { DocumentGallery } from "@/components/DocumentGallery";
import { Card } from "@/components/ui/card";
import { Upload, FileText, BarChart3 } from "lucide-react";
import { EnhancedInsightsSection } from "@/components/dashboard/EnhancedInsightsSection";

type EnhancedMainContentProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userId: string;
};

export const EnhancedMainContent = ({ activeTab, setActiveTab, userId }: EnhancedMainContentProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12">
            <TabsTrigger 
              value="upload" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload Documents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Document Gallery</span>
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Analytics & Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6">
            <div className="text-center pb-4">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Upload & Analyze Documents
              </h2>
              <p className="text-muted-foreground">
                Upload your legal documents for instant AI-powered analysis and insights
              </p>
            </div>
            <DocumentAnalysis />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="text-center pb-4">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Document Gallery
              </h2>
              <p className="text-muted-foreground">
                Manage and review all your analyzed documents in one place
              </p>
            </div>
            <DocumentGallery userId={userId} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="text-center pb-4">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analytics & Insights
              </h2>
              <p className="text-muted-foreground">
                Comprehensive analytics and insights from your document analysis
              </p>
            </div>
            <EnhancedInsightsSection userId={userId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};