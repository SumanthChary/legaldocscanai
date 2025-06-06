
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SummaryDisplayProps {
  summary: string;
  isEmergencyProcessing: boolean;
}

export const SummaryDisplay = ({ summary, isEmergencyProcessing }: SummaryDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formattedSummary = formatSummary(summary);

  return (
    <>
      <div className={`relative ${isExpanded ? '' : 'max-h-80 overflow-hidden'}`}>
        <div className={`p-6 rounded-xl border text-gray-700 whitespace-pre-line ${
          isEmergencyProcessing 
            ? 'border-yellow-200 bg-yellow-50' 
            : 'border-green-100 bg-gradient-to-br from-green-50/50 to-blue-50/50'
        }`}>
          {formattedSummary}
          
          {!isExpanded && summary.length > 500 && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent rounded-b-xl"></div>
          )}
        </div>
      </div>
      
      {summary.length > 500 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center hover:bg-blue-50"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show Full Analysis
            </>
          )}
        </Button>
      )}
    </>
  );
};

function formatSummary(text: string): string {
  let cleaned = text
    .replace(/^\s*---\s*$/gm, '')
    .replace(/^#+\s*/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .trim();

  const hasStructure = /^\d+\.\s|\n\s*[-•*]\s|\n\s*\d+\.\s/m.test(cleaned);
  
  if (hasStructure) {
    return cleaned
      .replace(/\n{3,}/g, '\n\n')
      .replace(/(\n\s*[-•*]\s.*?)(\n[^-•*\s])/g, '$1\n$2')
      .replace(/(\n\s*\d+\.\s.*?)(\n[^\d\s])/g, '$1\n$2');
  }
  
  return cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n');
}
