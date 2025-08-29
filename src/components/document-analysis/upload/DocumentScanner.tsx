import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentScannerProps {
  onScan: (file: File) => void;
  onClose: () => void;
}

export const DocumentScanner = ({ onScan, onClose }: DocumentScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const captureAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setProcessing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Apply basic image enhancements for document scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Simple contrast and brightness adjustment for better document visibility
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast and brightness
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128 + 10));     // Red
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128 + 10)); // Green
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128 + 10)); // Blue
      }
      
      context.putImageData(imageData, 0, 0);
      setScannedImage(canvas.toDataURL('image/jpeg', 0.8));
      stopCamera();
      
      toast({
        title: "Document Captured",
        description: "Image captured successfully!",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Capture Error",
        description: "Error capturing image. Try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }, [stopCamera, toast]);

  const confirmScan = useCallback(() => {
    if (!scannedImage) return;
    
    // Convert data URL to blob then to file
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `scanned-document-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          onScan(file);
          onClose();
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.src = scannedImage;
  }, [scannedImage, onScan, onClose]);

  const resetScan = useCallback(() => {
    setScannedImage(null);
    startCamera();
  }, [startCamera]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (scannedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Review Scanned Document</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={scannedImage} 
              alt="Scanned document" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          </div>
          
          <div className="flex gap-4 p-4 border-t">
            <Button variant="outline" onClick={resetScan} className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Rescan
            </Button>
            <Button onClick={confirmScan} className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Use This Scan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Scan Document</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Document overlay guide */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="border-2 border-primary border-dashed rounded-lg w-full max-w-sm aspect-[4/3] flex items-center justify-center">
                  <span className="text-primary-foreground bg-primary/90 px-3 py-2 rounded text-sm font-medium text-center">
                    Position document within frame
                  </span>
                </div>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
                <Button
                  onClick={captureAndProcess}
                  disabled={processing}
                  size="lg"
                  className="rounded-full w-16 h-16 md:w-20 md:h-20 shadow-lg"
                >
                  <Camera className="h-6 w-6 md:h-8 md:w-8" />
                </Button>
                <p className="text-white/90 text-xs md:text-sm bg-black/50 px-3 py-1 rounded-full">
                  {processing ? 'Processing...' : 'Tap to capture'}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Starting camera...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-background/95 backdrop-blur">
          <p className="text-sm text-muted-foreground text-center max-w-sm mx-auto">
            Position your document within the frame and tap the camera button to scan
          </p>
        </div>
      </div>
    </div>
  );
};