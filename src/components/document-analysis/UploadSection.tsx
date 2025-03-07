
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, File, AlertCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

type UploadSectionProps = {
  onSuccess?: () => void;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

export const UploadSection = ({ onSuccess }: UploadSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const isValidFileType = (fileName: string) => {
    const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 1).toLowerCase();
    return ALLOWED_FILE_TYPES.some(type => type.includes(extension));
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
      // Get the session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to upload documents",
          variant: "destructive",
        });
        return;
      }

      console.log("Uploading file:", file.name);
      
      // Read the file and create chunks if needed
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('fileType', file.type);
      formData.append('fileSize', file.size.toString());
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      const response = await supabase.functions.invoke('analyze-document', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      clearInterval(progressInterval);
      console.log("Upload response:", response);

      if (response.error) {
        console.error("Upload error:", response.error);
        setUploadError(response.error.message || "Upload failed");
        setUploadProgress(0);
        throw new Error(response.error.message || "Upload failed");
      }

      setUploadProgress(100);
      
      toast({
        title: "Document uploaded successfully",
        description: "AI analysis has started...",
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      clearFile();
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
      
      // Update the file input for consistency
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

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
          <div className="flex flex-col items-center">
            <div className="p-3 bg-primary/10 rounded-full mb-2">
              <File className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={clearFile}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-2" />
            <p className="font-medium mb-1">Drag and drop your file here</p>
            <p className="text-sm text-gray-500 mb-4">
              or click the button below to browse
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept={ALLOWED_FILE_TYPES.join(',')}
              className="max-w-xs"
            />
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md mb-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}
      
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="mt-4">
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
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
        <p className="text-xs text-gray-500 mt-2">
          Max file size: {(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB. 
          Supported formats: PDF, DOC, DOCX, TXT
        </p>
      </div>
    </Card>
  );
};
