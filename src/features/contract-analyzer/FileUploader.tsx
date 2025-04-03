
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUpload: (file: File) => Promise<void>;
  isAnalyzing: boolean;
}

export const FileUploader = ({ onFileUpload, isAnalyzing }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      await onFileUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      <form
        onDragEnter={handleDrag}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
          } ${selectedFile ? "border-green-500 bg-green-50" : ""}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <p className="text-lg font-medium">Drag & drop your contract here</p>
                <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, TXT</p>
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Select File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center">
                <FileText className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                className="text-red-500" 
                onClick={clearFile}
              >
                <X className="h-4 w-4 mr-2" /> Remove
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />
        </div>
        
        {selectedFile && !isAnalyzing && (
          <Button 
            type="submit" 
            className="w-full"
          >
            Analyze Contract
          </Button>
        )}
        
        {isAnalyzing && (
          <div className="space-y-3">
            <Progress value={45} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              Analyzing contract... This may take a moment.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
