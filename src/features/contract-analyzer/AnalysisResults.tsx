
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { ContractAnalysis } from "./ContractAnalyzer";

interface AnalysisResultsProps {
  analysis: ContractAnalysis;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const [activeTab, setActiveTab] = useState("summary");

  const getRiskBadge = (risk: 'high' | 'medium' | 'low' | 'none') => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-amber-500">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-green-500 border-green-500">Low Risk</Badge>;
      case 'none':
        return <Badge variant="outline" className="text-gray-500">No Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="clauses">Clauses</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg">{analysis.summary}</p>
            </CardContent>
          </Card>
          
          {analysis.missingTerms.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Missing Terms Detected</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {analysis.missingTerms.map((term, index) => (
                    <li key={index}>{term}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="clauses" className="pt-4">
          <div className="space-y-4">
            {analysis.clauses.map((clause, index) => (
              <Card key={index}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{clause.title}</h3>
                    {getRiskBadge(clause.risk)}
                  </div>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{clause.content}</p>
                  {clause.explanation && (
                    <div className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-md">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{clause.explanation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="pt-4">
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Recommendations</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="py-1">{recommendation}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};
