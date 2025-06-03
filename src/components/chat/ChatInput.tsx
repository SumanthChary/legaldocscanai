
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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

  return (
    <>
      <FileAttachment 
        file={file}
        onFileChange={onFileChange}
        onFileRemove={onFileRemove}
        onFileSelect={triggerFileInput}
        fileInputRef={fileInputRef}
      />
      
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about legal documents, contracts, compliance..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), onSend())}
            className="min-h-[48px] max-h-32 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/80 backdrop-blur-sm resize-none scrollbar-hide"
            rows={1}
          />
        </div>
        <Button 
          size="default" 
          onClick={onSend} 
          disabled={isLoading} 
          className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};
