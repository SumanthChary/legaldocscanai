import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, X, Loader2 } from "lucide-react";

interface TextSelectionAIProps {
  selectedText: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export const TextSelectionAI = ({ selectedText, position, onClose }: TextSelectionAIProps) => {
  const [isAsking, setIsAsking] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  const handleAskAI = async () => {
    setIsAsking(true);
    setShowResponse(true);
    
    try {
      // Simulate AI response - in real implementation, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiResponse(`Based on the selected text: "${selectedText.substring(0, 100)}${selectedText.length > 100 ? '...' : ''}", this appears to be a legal clause that requires careful consideration. The language suggests specific obligations and potential implications for the parties involved.`);
    } catch (error) {
      setAiResponse("Sorry, I couldn't analyze this text right now. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <>
      {/* Selection popup */}
      <div 
        className="fixed z-50 bg-white border border-gray-900 rounded-lg shadow-lg p-2"
        style={{ 
          left: position.x, 
          top: position.y - 50,
          transform: 'translateX(-50%)'
        }}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={handleAskAI}
          className="text-xs font-editorial-new border-gray-900 hover:bg-gray-50"
          disabled={isAsking}
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Ask Law AI
        </Button>
      </div>

      {/* AI Response Modal */}
      {showResponse && (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border border-gray-900 bg-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-editorial-new font-light">Law AI Analysis</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    onClose();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 font-editorial-new">Selected text:</p>
                <p className="text-sm mt-1 font-editorial-new">{selectedText}</p>
              </div>

              <div className="border border-gray-900 rounded-lg p-4">
                {isAsking ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-editorial-new">AI is analyzing...</span>
                  </div>
                ) : (
                  <p className="text-sm font-editorial-new leading-relaxed">{aiResponse}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};