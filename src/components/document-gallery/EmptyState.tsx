
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const EmptyState = () => {
  return (
    <Card className="p-4 sm:p-8 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
      <h3 className="text-lg font-medium">No documents found</h3>
      <p className="text-sm text-gray-500 mt-2">
        Upload your first document to get started with the analysis
      </p>
    </Card>
  );
};
