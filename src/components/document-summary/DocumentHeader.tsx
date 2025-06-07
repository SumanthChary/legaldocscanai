
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentHeaderProps {
  refreshAnalysis: () => void;
  refreshing: boolean;
  analysisStatus?: string;
}

export const DocumentHeader = ({ analysisStatus }: DocumentHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button 
        variant="outline" 
        size="lg" 
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-xl px-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back to Documents</span>
      </Button>
      
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span className="text-sm font-medium">AI Analysis</span>
      </div>
    </div>
  );
};
