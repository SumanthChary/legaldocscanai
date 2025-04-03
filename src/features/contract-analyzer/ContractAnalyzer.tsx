
import { useState } from "react";
import { FileUploader } from "./FileUploader";
import { AnalysisResults } from "./AnalysisResults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ContractAnalysis = {
  id: string;
  clauses: {
    title: string;
    content: string;
    risk: 'high' | 'medium' | 'low' | 'none';
    explanation?: string;
  }[];
  missingTerms: string[];
  summary: string;
  recommendations: string[];
};

export const ContractAnalyzer = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // This is a placeholder function that will be implemented with the actual API call
  const handleAnalyzeContract = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // This is mock data - will be replaced with real API response
      setAnalysis({
        id: "sample-analysis-1",
        clauses: [
          {
            title: "Termination Clause",
            content: "This Agreement may be terminated by either party with 30 days notice...",
            risk: "medium",
            explanation: "Standard termination period, but lacks specific conditions for termination."
          },
          {
            title: "Liability Limitation",
            content: "Under no circumstances shall liability exceed...",
            risk: "high",
            explanation: "This clause heavily favors one party and may not be enforceable in all jurisdictions."
          }
        ],
        missingTerms: ["Dispute Resolution", "Force Majeure"],
        summary: "This is a standard service agreement with moderate risk provisions.",
        recommendations: [
          "Add a dispute resolution clause",
          "Clarify termination conditions",
          "Review liability limitations"
        ]
      });
      
      setIsAnalyzing(false);
      setActiveTab("results");
    }, 2000);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>AI Contract Analysis</CardTitle>
        <CardDescription>
          Upload a contract to get AI-powered analysis, risk assessment, and recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Contract</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis && !isAnalyzing}>
              Analysis Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="py-4">
            <FileUploader onFileUpload={handleAnalyzeContract} isAnalyzing={isAnalyzing} />
          </TabsContent>
          
          <TabsContent value="results" className="py-4">
            {analysis && <AnalysisResults analysis={analysis} />}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
