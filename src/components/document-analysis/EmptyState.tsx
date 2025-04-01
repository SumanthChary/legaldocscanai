
import React from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12 px-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents analyzed yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Upload your first legal document to experience the power of AI-assisted document analysis
      </p>
      <Button 
        onClick={() => navigate("/document-analysis")}
        className="inline-flex items-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Document
      </Button>
    </div>
  );
};
