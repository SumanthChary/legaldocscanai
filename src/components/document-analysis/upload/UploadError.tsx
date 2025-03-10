
import { AlertCircle } from "lucide-react";

type UploadErrorProps = {
  errorMessage: string;
};

export const UploadError = ({ errorMessage }: UploadErrorProps) => {
  if (!errorMessage) return null;
  
  return (
    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md mb-4">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{errorMessage}</p>
    </div>
  );
};
