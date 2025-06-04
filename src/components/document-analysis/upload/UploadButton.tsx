
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

type UploadButtonProps = {
  handleUpload: () => void;
  isUploading: boolean;
  disabled: boolean;
};

export const UploadButton = ({ handleUpload, isUploading, disabled }: UploadButtonProps) => {
  return (
    <Button 
      onClick={handleUpload}
      disabled={disabled || isUploading}
      size="lg"
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
    >
      {isUploading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Lightning Analysis in Progress...
        </>
      ) : (
        <>
          <Upload className="h-5 w-5" />
          Start Lightning Analysis
        </>
      )}
    </Button>
  );
};
