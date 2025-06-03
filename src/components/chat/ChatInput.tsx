
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { FileAttachment } from "./FileAttachment";
import { useRef } from "react";

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
};

export const ChatInput = ({ 
  input, 
  setInput, 
  onSend, 
  isLoading, 
  file, 
  onFileChange, 
  onFileRemove 
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (input.trim() || file)) {
        onSend();
      }
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-gray-50/95 via-white/90 to-transparent backdrop-blur-lg border-t border-gray-200/50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <FileAttachment 
          file={file}
          onFileChange={onFileChange}
          onFileRemove={onFileRemove}
          onFileSelect={triggerFileInput}
          fileInputRef={fileInputRef}
        />
        
        <div className="flex items-end gap-3 md:gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={triggerFileInput}
            className="h-12 w-12 md:h-14 md:w-14 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex-shrink-0"
          >
            <Paperclip className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about legal documents, contracts, compliance..."
              onKeyDown={handleKeyDown}
              className="min-h-[60px] md:min-h-[70px] max-h-40 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/90 backdrop-blur-sm text-base md:text-lg py-4 px-5 leading-relaxed"
              rows={1}
            />
          </div>
          
          <Button 
            size="default" 
            onClick={onSend} 
            disabled={isLoading || (!input.trim() && !file)}
            className="h-12 w-12 md:h-14 md:w-14 px-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
