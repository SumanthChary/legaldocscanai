import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useFileUpload } from "@/components/document-analysis/upload/useFileUpload";
import { useNavigate } from "react-router-dom";

export default function MobileScan() {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState<"camera" | "upload" | null>(null);
  
  const {
    file,
    setFile,
    isUploading,
    uploadProgress,
    uploadError,
    fileInputRef,
    handleFileChange,
    clearFile,
    handleUpload,
    handleDrop,
    handleDragOver,
    ALLOWED_FILE_TYPES
  } = useFileUpload(() => {
    navigate("/history");
  });

  const handleScanMode = (mode: "camera" | "upload") => {
    setScanMode(mode);
    if (mode === "upload") {
      fileInputRef.current?.click();
    }
  };

  return (
    <MobileLayout>
      <MobileHeader title="Scan Document" showBack />
      
      <div className="px-4 py-6 space-y-6">
        {!file && !scanMode && (
          <>
            <div className="text-center space-y-2">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Choose Scan Method</h2>
              <p className="text-muted-foreground">
                How would you like to add your document?
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => handleScanMode("camera")}
                className="w-full h-14 text-lg gap-3"
                size="lg"
              >
                <Camera className="w-6 h-6" />
                Take Photo
              </Button>
              
              <Button
                onClick={() => handleScanMode("upload")}
                variant="outline"
                className="w-full h-14 text-lg gap-3"
                size="lg"
              >
                <Upload className="w-6 h-6" />
                Upload File
              </Button>
            </div>

            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Supported Formats</h4>
              <div className="flex flex-wrap gap-2">
                {ALLOWED_FILE_TYPES.slice(0, 4).map((type) => (
                  <span key={type} className="text-xs bg-background px-2 py-1 rounded">
                    {type.replace('.', '').toUpperCase()}
                  </span>
                ))}
              </div>
            </Card>
          </>
        )}

        {file && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFile}
                  className="w-full"
                >
                  Choose Different File
                </Button>
              </div>
            </Card>

            {!isUploading && (
              <Button
                onClick={handleUpload}
                className="w-full h-14 text-lg gap-3"
                size="lg"
              >
                <Sparkles className="w-6 h-6" />
                Analyze Document
              </Button>
            )}
          </div>
        )}

        {uploadError && (
          <Card className="p-4 border-destructive/50 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{uploadError}</p>
          </Card>
        )}

        {isUploading && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Analyzing Document</h3>
                <p className="text-sm text-muted-foreground">
                  AI is processing your document...
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={ALLOWED_FILE_TYPES.join(',')}
          className="hidden"
        />
      </div>
    </MobileLayout>
  );
}