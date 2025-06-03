
import { Button } from "@/components/ui/button";
import { Paperclip, X, FileText } from "lucide-react";

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
        <div className="mb-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/80 px-5 py-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center text-sm md:text-base">
            <div className="p-2 bg-blue-50 rounded-lg mr-3">
              <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div>
              <span className="font-semibold text-gray-800 block truncate max-w-[200px] md:max-w-[300px]">
                {file.name}
              </span>
              <span className="text-gray-500 text-sm">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 hover:bg-red-50 hover:text-red-600 transition-colors duration-200" 
            onClick={onFileRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};
