
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

export const useFileUpload = (onSuccess?: () => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const isValidFileType = (fileName: string) => {
    const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 1).toLowerCase();
    return ALLOWED_FILE_TYPES.some(type => type.replace('.', '') === extension);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("Selected file:", selectedFile.name, selectedFile.type, selectedFile.size);
      
      if (selectedFile.size > MAX_FILE_SIZE) {
        setUploadError(`File size exceeds limit (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      if (!isValidFileType(selectedFile.name)) {
        setUploadError(`Invalid file type. Supported types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload documents",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      console.log("Uploading file:", file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      try {
        const response = await supabase.functions.invoke('analyze-document', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        clearInterval(progressInterval);
        console.log("Upload response:", response);

        if (response.error) {
          console.error("Upload error from API:", response.error);
          setUploadError(response.error.message || "Upload failed");
          setUploadProgress(0);
          throw new Error(response.error.message || "Upload failed");
        }

        setUploadProgress(100);
        
        toast({
          title: "Document uploaded successfully",
          description: "AI analysis has started...",
        });
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
        
        clearFile();
      } catch (invokeError: any) {
        console.error("Function invoke error:", invokeError);
        setUploadError(invokeError.message || "Error calling analyze-document function");
        throw invokeError;
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "An unexpected error occurred");
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setUploadError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.size > MAX_FILE_SIZE) {
        setUploadError(`File size exceeds limit (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB)`);
        return;
      }
      
      if (!isValidFileType(droppedFile.name)) {
        setUploadError(`Invalid file type. Supported types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        return;
      }
      
      setFile(droppedFile);
      
      if (fileInputRef.current) {
        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(droppedFile);
          fileInputRef.current.files = dataTransfer.files;
        } catch (error) {
          console.error("Error setting file input value:", error);
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return {
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
  };
};
