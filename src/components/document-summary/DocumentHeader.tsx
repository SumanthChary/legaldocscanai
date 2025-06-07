
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 rounded-lg sm:rounded-xl px-3 sm:px-6 text-xs sm:text-sm"
      >
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="font-medium">Back to Documents</span>
      </Button>
      
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg">
        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
        <span className="text-xs sm:text-sm font-medium">AI Analysis</span>
      </div>
    </div>
  );
};
