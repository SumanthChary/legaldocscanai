
import { useState } from "react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

export const useFileValidation = () => {
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isValidFileType = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return ALLOWED_FILE_TYPES.includes(extension);
  };

  const validateFile = (file: File): boolean => {
    setUploadError(null);
    
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds limit (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`);
      return false;
    }
    
    if (!isValidFileType(file.name)) {
      setUploadError(`Invalid file type. Supported types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const clearError = () => setUploadError(null);

  return {
    uploadError,
    validateFile,
    clearError,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
  };
};
