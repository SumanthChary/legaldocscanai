
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

type FileUploadAreaProps = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allowedFileTypes: string[];
};

export const FileUploadArea = ({
  handleFileChange,
  handleDrop,
  handleDragOver,
  fileInputRef,
  allowedFileTypes,
}: FileUploadAreaProps) => {
  return (
    <div
      className="border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors border-gray-200 hover:border-primary/20"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col items-center">
        <Upload className="h-12 w-12 text-gray-400 mb-2" />
        <p className="font-medium mb-1">Drag and drop your file here</p>
        <p className="text-sm text-gray-500 mb-4">
          or click the button below to browse
        </p>
        <Input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={allowedFileTypes.join(',')}
          className="max-w-xs"
        />
      </div>
    </div>
  );
};
