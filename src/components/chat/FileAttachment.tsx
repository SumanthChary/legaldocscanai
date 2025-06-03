
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";

type FileAttachmentProps = {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
  onFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

export const FileAttachment = ({ 
  file, 
  onFileChange, 
  onFileRemove, 
  onFileSelect, 
  fileInputRef 
}: FileAttachmentProps) => {
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      
      {file && (
        <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-0 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Paperclip className="h-4 w-4 mr-2 text-blue-600" />
            <span className="truncate max-w-[200px] font-medium">{file.name}</span>
            <span className="ml-2 text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600" 
            onClick={onFileRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Button 
        variant="outline" 
        size="icon" 
        onClick={onFileSelect}
        className="h-12 w-12 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
    </>
  );
};
