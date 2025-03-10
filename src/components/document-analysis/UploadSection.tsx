
import { Card } from "@/components/ui/card";
import { FileUploadArea } from "./upload/FileUploadArea";
import { FilePreview } from "./upload/FilePreview";
import { UploadError } from "./upload/UploadError";
import { UploadProgress } from "./upload/UploadProgress";
import { UploadButton } from "./upload/UploadButton";
import { UploadTips } from "./upload/UploadTips";
import { useFileUpload } from "./upload/useFileUpload";

type UploadSectionProps = {
  onSuccess?: () => void;
};

export const UploadSection = ({ onSuccess }: UploadSectionProps) => {
  const {
    file,
    isUploading,
    uploadProgress,
    uploadError,
    fileInputRef,
    handleFileChange,
    clearFile,
    handleUpload,
    handleDrop,
    handleDragOver,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
  } = useFileUpload(onSuccess);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors
          ${file ? 'border-primary/20 bg-primary/5' : 'border-gray-200 hover:border-primary/20'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <FilePreview file={file} clearFile={clearFile} />
        ) : (
          <FileUploadArea
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            fileInputRef={fileInputRef}
            allowedFileTypes={ALLOWED_FILE_TYPES}
          />
        )}
      </div>
      
      <UploadError errorMessage={uploadError || ""} />
      
      <UploadProgress isUploading={isUploading} progress={uploadProgress} />
      
      <div className="mt-4">
        <UploadButton
          handleUpload={handleUpload}
          isUploading={isUploading}
          disabled={!file}
        />
        
        <UploadTips
          maxFileSize={MAX_FILE_SIZE}
          allowedFileTypes={ALLOWED_FILE_TYPES}
        />
      </div>
    </Card>
  );
};
