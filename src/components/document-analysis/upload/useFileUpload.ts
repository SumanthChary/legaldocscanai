
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

export const useFileUpload = (onSuccess?: () => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const isValidFileType = (fileName: string) => {
    const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return ALLOWED_FILE_TYPES.includes(extension);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      console.log("📁 Selected file:", selectedFile.name, selectedFile.type, selectedFile.size);
      
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
    setUploadProgress(0);
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

      console.log("🚀 Starting LIGHTNING upload for file:", file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Enhanced progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5; // Faster progress
          return newProgress > 85 ? 85 : newProgress;
        });
      }, 150);

      const startTime = Date.now();

      try {
        const response = await supabase.functions.invoke('analyze-document', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        
        clearInterval(progressInterval);
        const processingTime = Date.now() - startTime;
        console.log(`📋 LIGHTNING upload response in ${processingTime}ms:`, response);

        if (response.error) {
          console.error("❌ Upload error from API:", response.error);
          setUploadError(response.error.message || "Upload failed");
          setUploadProgress(0);
          throw new Error(response.error.message || "Upload failed");
        }

        // Check if we got a valid response with analysis_id
        if (!response.data?.analysis_id) {
          console.error("❌ No analysis_id in response:", response);
          throw new Error("Analysis failed - no ID returned");
        }

        setUploadProgress(100);
        
        toast({
          title: "⚡ LIGHTNING Analysis Complete!",
          description: `${file.name} analyzed in ${Math.round(processingTime/1000)}s using advanced AI!`,
        });
        
        console.log(`✅ Analysis completed successfully: ${response.data.analysis_id}`);
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
            clearFile();
          }, 1000);
        } else {
          setTimeout(() => {
            clearFile();
          }, 1500);
        }
        
      } catch (invokeError: any) {
        clearInterval(progressInterval);
        console.error("❌ Function invoke error:", invokeError);
        setUploadError(invokeError.message || "Error calling analyze-document function");
        setUploadProgress(0);
        throw invokeError;
      }
    } catch (error: any) {
      console.error("❌ Upload error:", error);
      setUploadError(error.message || "An unexpected error occurred");
      setUploadProgress(0);
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
      console.log("📁 Dropped file:", droppedFile.name, droppedFile.type, droppedFile.size);
      
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
