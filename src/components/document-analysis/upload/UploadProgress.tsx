
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type UploadProgressProps = {
  isUploading: boolean;
  progress: number;
};

export const UploadProgress = ({ isUploading, progress }: UploadProgressProps) => {
  if (!isUploading) return null;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
