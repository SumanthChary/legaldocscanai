
import { Button } from "@/components/ui/button";
import { X, File, FileText, FileType } from "lucide-react";

type FilePreviewProps = {
  file: File;
  clearFile: () => void;
};

export const FilePreview = ({ file, clearFile }: FilePreviewProps) => {
  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-8 w-8 text-blue-500" />;
      case 'txt':
        return <FileType className="h-8 w-8 text-gray-500" />;
      default:
        return <File className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="p-3 bg-primary/10 rounded-full mb-2">
        {getFileIcon()}
      </div>
      <p className="font-medium">{file.name}</p>
      <p className="text-sm text-gray-500">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2"
        onClick={clearFile}
      >
        <X className="h-4 w-4 mr-1" />
        Remove
      </Button>
    </div>
  );
};
