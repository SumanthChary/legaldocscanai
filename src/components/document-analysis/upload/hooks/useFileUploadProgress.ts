
import { useState } from "react";

export const useFileUploadProgress = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
  };

  const updateProgress = () => {
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        return newProgress > 85 ? 85 : newProgress;
      });
    }, 150);
    return progressInterval;
  };

  const completeUpload = () => {
    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
    }, 1000);
  };

  const failUpload = () => {
    setUploadProgress(0);
    setIsUploading(false);
  };

  return {
    isUploading,
    uploadProgress,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload
  };
};
