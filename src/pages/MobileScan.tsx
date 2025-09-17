import { useState } from "react";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, FileText, CheckCircle2, AlertCircle, Scan, Shield, ArrowLeft, FolderOpen } from "lucide-react";
import { useFileUpload } from "@/components/document-analysis/upload/useFileUpload";
import { GoogleDriveUpload } from "@/components/mobile/GoogleDriveUpload";
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
      <MobileHeader title="Document Upload" showBack />
      
      <div className="px-4 py-4 space-y-6 pb-24 overflow-y-auto scrollbar-thin max-h-[calc(100vh-160px)]">
        {!file && !scanMode && (
          <>
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center mx-auto">
                <Shield className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Upload Document</h1>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  Choose how you'd like to add your legal document for AI-powered analysis
                </p>
              </div>
            </div>

            {/* Upload Options Tabs */}
            <Tabs defaultValue="device" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30 h-12">
                <TabsTrigger value="camera" className="h-10 rounded-lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </TabsTrigger>
                <TabsTrigger value="device" className="h-10 rounded-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Device
                </TabsTrigger>
                <TabsTrigger value="drive" className="h-10 rounded-lg">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Drive
                </TabsTrigger>
              </TabsList>

              <TabsContent value="camera" className="space-y-4">
                <Card 
                  className="p-8 border-0 bg-gradient-to-br from-primary/5 to-primary/10 cursor-pointer transition-all duration-200 hover:shadow-lg mobile-tap"
                  onClick={() => handleScanMode("camera")}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Camera Capture</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take a high-quality photo of your document using your device camera
                      </p>
                      <Button className="w-full h-12 text-base">
                        <Camera className="w-5 h-5 mr-2" />
                        Open Camera
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="device" className="space-y-4">
                <Card 
                  className="p-8 border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 cursor-pointer transition-all duration-200 hover:shadow-lg mobile-tap"
                  onClick={() => handleScanMode("upload")}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Device Upload</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select files from your device storage or recent downloads
                      </p>
                      <Button className="w-full h-12 text-base bg-emerald-600 hover:bg-emerald-700">
                        <Upload className="w-5 h-5 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="drive" className="space-y-4">
                <GoogleDriveUpload onFileSelect={setFile} />
              </TabsContent>
            </Tabs>

            {/* Supported Formats */}
            <Card className="p-4 border-0 bg-gradient-to-br from-background to-muted/20">
              <h4 className="font-medium text-foreground mb-3">Supported Formats</h4>
              <div className="grid grid-cols-2 gap-2">
                {ALLOWED_FILE_TYPES.slice(0, 4).map((type) => (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-muted-foreground">
                      {type.replace('.', '').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {file && (
          <div className="space-y-6">
            {/* File Preview */}
            <Card className="p-6 border-0 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{file.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>{file.type.split('/')[1].toUpperCase()}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={clearFile}
                  className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Choose Different File
                </Button>
              </div>
            </Card>

            {/* Analysis Button */}
            {!isUploading && (
              <div className="space-y-3">
                <Button
                  onClick={handleUpload}
                  className="w-full h-14 text-lg gap-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  size="lg"
                >
                  <Scan className="w-5 h-5" />
                  Start Analysis
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Your document will be processed securely and privately
                </p>
              </div>
            )}
          </div>
        )}

        {uploadError && (
          <Card className="p-4 border-0 bg-gradient-to-br from-red-50/50 to-red-100/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-red-900 mb-1">Upload Failed</h4>
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            </div>
          </Card>
        )}

        {isUploading && (
          <Card className="p-6 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                  <div className="animate-spin">
                    <Scan className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-1">Processing Document</h3>
                <p className="text-sm text-muted-foreground">
                  Your document is being analyzed with advanced technology...
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Analysis Progress</span>
                  <span className="font-medium text-primary">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-3" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    This usually takes 30-60 seconds
                  </p>
                </div>
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