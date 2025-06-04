
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { useRef } from "react";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";

type ModernChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
};

export const ModernChatInput = ({ 
  input, 
  setInput, 
  onSend, 
  isLoading, 
  file, 
  onFileChange, 
  onFileRemove 
}: ModernChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!isLoading && (input.trim() || file)) {
      onSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-gray-50/95 via-white/90 to-transparent backdrop-blur-lg border-t border-gray-200/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="w-full shadow-lg border-2 border-gray-200/80 hover:border-blue-300 focus-within:border-blue-500 transition-all duration-200"
          maxHeight={200}
        >
          {/* File Attachment Display */}
          {file && (
            <div className="flex flex-wrap gap-2 pb-3 px-2">
              <div className="bg-blue-50 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm border border-blue-200">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-gray-800 truncate max-w-[200px] md:max-w-[300px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={onFileRemove}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 ml-2"
                >
                  <X className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          )}

          <PromptInputTextarea 
            placeholder="Ask about legal documents, contracts, compliance..."
            className="text-base md:text-lg py-3 px-4 min-h-[60px] leading-relaxed"
          />

          <PromptInputActions className="flex items-center justify-between gap-3 pt-3 px-2">
            <PromptInputAction tooltip="Attach files" side="top">
              <label
                htmlFor="file-upload"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={onFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <Paperclip className="h-5 w-5 text-gray-600" />
              </label>
            </PromptInputAction>

            <PromptInputAction
              tooltip={isLoading ? "Stop generation" : "Send message"}
              side="top"
            >
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isLoading || (!input.trim() && !file)}
              >
                {isLoading ? (
                  <Square className="h-5 w-5 fill-current" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  );
};
