
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentHeaderProps {
  refreshAnalysis: () => void;
  refreshing: boolean;
  analysisStatus?: string;
}

export const DocumentHeader = ({ analysisStatus }: DocumentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Button>
    </div>
  );
};
