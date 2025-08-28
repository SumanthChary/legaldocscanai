
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { ScanButton } from './ScanButton';

type FileUploadAreaProps = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  allowedFileTypes: string[];
  onFilesAccepted?: (files: File[]) => void;
  disabled?: boolean;
};

export const FileUploadArea = ({
  handleFileChange,
  handleDrop,
  handleDragOver,
  fileInputRef,
  allowedFileTypes,
  onFilesAccepted,
  disabled = false,
}: FileUploadAreaProps) => {
  const handleScanFile = useCallback((file: File) => {
    if (onFilesAccepted) {
      onFilesAccepted([file]);
    }
  }, [onFilesAccepted]);
  return (
    <div className="flex flex-col items-center">
      <Upload className="h-12 w-12 text-gray-400 mb-2" />
      <p className="font-medium mb-1">Drag and drop your file here</p>
      <p className="text-sm text-gray-500 mb-2">
        Supported formats: {allowedFileTypes.join(', ')}
      </p>
      <p className="text-sm text-gray-500 mb-4">or click below to browse</p>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <label 
          htmlFor="file-upload" 
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md cursor-pointer transition-colors justify-center"
        >
          <FileText className="h-4 w-4" />
          <span>Choose file</span>
        </label>
        
        {onFilesAccepted && (
          <ScanButton onScan={handleScanFile} disabled={disabled} />
        )}
      </div>
      <Input
        id="file-upload"
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept={allowedFileTypes.join(',')}
        className="hidden"
      />
    </div>
  );
};
