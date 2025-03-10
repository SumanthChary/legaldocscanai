
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

type UploadButtonProps = {
  handleUpload: () => void;
  isUploading: boolean;
  disabled: boolean;
};

export const UploadButton = ({ 
  handleUpload, 
  isUploading, 
  disabled 
}: UploadButtonProps) => {
  return (
    <Button
      onClick={handleUpload}
      disabled={disabled || isUploading}
      className="w-full sm:w-auto flex items-center gap-2"
    >
      {isUploading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4" />
          Upload Document
        </>
      )}
    </Button>
  );
};
