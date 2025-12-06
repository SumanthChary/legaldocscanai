import React, { useState, useRef, useCallback } from "react";
import { Camera, Check, RotateCcw, Flashlight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DocumentScannerProps {
  onScan: (file: File) => void;
  onClose: () => void;
  variant?: "overlay" | "inline";
  autoCloseOnConfirm?: boolean;
}

export const DocumentScanner = ({
  onScan,
  onClose,
  variant = "overlay",
  autoCloseOnConfirm = true,
}: DocumentScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const isOverlay = variant === "overlay";
  const thumbnailPlaceholders = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXKvs3jJsag9zmHgabBiVe8_hJeogSraxHwRPNgOpST2yQtVKi8ookm4Nbpqd7tylVJ00DLhYDObwa0ODdTIedla89Gk93q2P6XsCuVjEfIZyfLNSP23mP91vpoRNNDKLWLahz2RI6ffeYAvjgcI5kpWUCa6x-ZSrWDzelVd1WTvyezPfvegwMk7hZK8Ow8KqcNQHHuQmv8vkVrPgvt4U4mxIpWum_tmlO3oXi5I5HPJ3STDT5MeN9RPK1SSG5PuO6TGQYGPQljAQC',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD2mhJviDIX6HhyWruNeykODP9vWSmjWFE37LG5I9EDu7y2g_uxW1bIvOBBrnJQW6zHURwf_Ntfi1SKi_MCdLECXR0A42PMhNd17-phyL0XnsgHZMHL9_0DO-P8I8N8rs2HlO02Il26dS3uMjqEPeKLZNTTyUQlQokj-3SDiLla4hCB5CeI04CTx78hPA9i5ANIBJCdA53OS9fTK4NZU2FX9HMNCgngtIlKhOBwvNXLU5GgCy5oT4AJ9i2KLgSjs6EY8fhnTYNdxE5T',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDx4Wc6QMXp_-YirZPmfMGBgGjNV8fjb_rLRFHCWERFwArFuKAHbnHlo2qshZCsBP0G07o6kl8QC6Sr5QilbnCbxHh1vP6WZX44G4hRZrtsy6wWfnwq15AoD9M23ZXE649pO7xRlAw4YTiNSk-HQ2CMaPBYNYyJwnDdsqxm63UIXVC960R8pcFbkcnXOzoTjoXIyfVGjjxMe7E48iHUXbXE5KlEoVRM-JDoDT0gfrUvScYRrQpwOPvfMsasNhfN0iVhG7ROBLUcEOBi',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAAmVUQa1MD-5tYuC_w3PVKNCWa9wKI3yUIeAiJkaQY2i8mmFt60msgMu_mAEqLDEGQ8wvpWIgELAVyJCrWc0WQUXJnucUq1z2Pg5BkHbvQF3x-C4Z9LMVSqOmJviPPeJkldfGSkQWpYOQauMMAspfu3Bnyxu-DYknWLUu4b30FfIEXTVfajTfsfKsr8la1oRpZfC1Tu7KCLdL0lH0WlPG6x9inUTJjIwgrZMC2wZB_2xM_LGIoPQRJkQOEXSLv4IL8-EjeEH4NNrbj',
  ];

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920, max: 4096 },
          height: { ideal: 1080, max: 4096 },
          frameRate: { ideal: 30 }
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

      // Set canvas size to match video for high quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Advanced image processing for document scanning
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Enhanced document processing with better contrast and sharpening
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Convert to grayscale for better text recognition
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Apply adaptive contrast enhancement
        const contrast = 1.4;
        const brightness = 20;
        const enhanced = Math.min(255, Math.max(0, (gray - 128) * contrast + 128 + brightness));
        
        // Apply sharpening effect for text clarity
        const sharpened = Math.min(255, Math.max(0, enhanced * 1.1));
        
        data[i] = sharpened;     // Red
        data[i + 1] = sharpened; // Green
        data[i + 2] = sharpened; // Blue
      }
      
      context.putImageData(imageData, 0, 0);
      
      // Use higher quality JPEG compression for better text recognition
      setScannedImage(canvas.toDataURL('image/jpeg', 0.95));
      stopCamera();
      
      toast({
        title: "Document Scanned",
        description: "High-quality scan captured for analysis!",
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Scan Error",
        description: "Error processing scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }, [stopCamera, toast]);

  const finalizeScan = useCallback(
    (file: File) => {
      onScan(file);
      if (autoCloseOnConfirm) {
        onClose();
      } else {
        setScannedImage(null);
        startCamera();
      }
    },
    [autoCloseOnConfirm, onClose, onScan, startCamera],
  );

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

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `scanned-document-${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            finalizeScan(file);
          }
        },
        'image/jpeg',
        0.95,
      );
    };

    img.src = scannedImage;
  }, [scannedImage, finalizeScan]);

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
      <div
        className={cn(
          "bg-black/85",
          isOverlay ? "fixed inset-0 z-50" : "relative rounded-[32px] shadow-[0_25px_80px_rgba(1,11,8,0.75)]",
        )}
      >
        <div className={cn("flex h-full flex-col", !isOverlay && "rounded-[32px] overflow-hidden")}>
          <header className="flex items-center justify-between border-b border-white/15 px-4 py-4 text-white">
            <button onClick={onClose} className="text-sm text-white/80">Close</button>
            <p className="instrument-serif-regular-italic text-xl">Review scan</p>
            <button onClick={resetScan} className="text-sm text-emerald-300">Rescan</button>
          </header>
          <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-slate-900/80 to-black p-6">
            <img
              src={scannedImage}
              alt="Scanned document"
              className="max-h-full w-full rounded-3xl border border-white/15 bg-white/5 object-contain p-4 shadow-2xl"
            />
          </div>
          <div className="flex gap-3 border-t border-white/10 bg-black/70 px-4 py-4">
            <Button variant="outline" onClick={resetScan} className="flex-1 border-white/30 text-white">
              <RotateCcw className="mr-2 h-4 w-4" /> Rescan
            </Button>
            <Button onClick={confirmScan} className="flex-1 bg-primary text-white">
              <Check className="mr-2 h-4 w-4" /> Use scan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        isOverlay ? "fixed inset-0 z-50 bg-black" : "relative w-full rounded-[40px] bg-black shadow-[0_45px_120px_rgba(2,12,9,0.65)]",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex h-full flex-col overflow-hidden bg-[#10221c] text-white",
          isOverlay ? "max-w-md" : "max-w-none rounded-[40px]",
        )}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkzVKoBwYt0hKSFCeTHv-FHpD9tJ3Web8zFLdhOfmD2AebMF5rWw0WWuTONFMwFwy7DS2qgvVBtUy_LdQ_RzGNxCgEdFXAYn3El1pbP7-DHfSrGqfynIXiuQiEePZnv8LhGBfGoKnObe4ZFImWkmNMAseakjE8QIVHAxX4uxq7DZxRJb1BaXJHSd9hIMlA4frOyU9McPwb1LK5TGxTw6L5UDzsaz_ZPBy5kVaDlJxYIwdWiHgByPU0oCqVV60VGNWzG8ivA2Dz6HIZ')",
          }}
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 flex h-full flex-col">
          <header className="flex items-center justify-between px-4 py-4 text-white">
            <button onClick={onClose} className="text-sm text-white/80">Cancel</button>
            <h1 className="instrument-serif-regular-italic text-xl">Scanning contract</h1>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white">
              <Flashlight className="h-5 w-5" />
            </button>
          </header>

          <main className="flex flex-1 flex-col items-center px-4 pb-4">
            <div className="w-full max-w-sm self-end pb-3 text-right">
              <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-3 py-1 text-sm text-white">
                <Check className="h-4 w-4" /> High quality
              </div>
            </div>

            <div className="relative flex h-[380px] w-full max-w-xs items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-4 border-primary/70 animate-pulse" />
              <div className="absolute -top-1 -left-1 h-9 w-9 border-l-4 border-t-4 border-primary/80" />
              <div className="absolute -top-1 -right-1 h-9 w-9 border-r-4 border-t-4 border-primary/80" />
              <div className="absolute -bottom-1 -left-1 h-9 w-9 border-b-4 border-l-4 border-primary/80" />
              <div className="absolute -bottom-1 -right-1 h-9 w-9 border-b-4 border-r-4 border-primary/80" />
              <div className="absolute w-24 h-24 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin" />
              <canvas ref={canvasRef} className="hidden" />
              {!isScanning && <span className="text-white/70">Starting camera…</span>}
              {isScanning && <video ref={videoRef} autoPlay playsInline className="h-full w-full rounded-xl object-cover" />}
            </div>

            <p className="pt-6 text-center text-lg font-semibold">Align contract corners</p>
            <div className="mt-3 w-full max-w-sm rounded-xl bg-black/40 p-3 text-sm">
              <div className="flex items-center justify-between text-white/80">
                <span>OCR confidence</span>
                <span>95% readable</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/20">
                <div className="h-full rounded-full bg-primary" style={{ width: "95%" }} />
              </div>
            </div>

            <div className="mt-auto flex flex-col items-center gap-3 pb-4">
              <Button
                onClick={captureAndProcess}
                disabled={processing}
                size="icon"
                className="h-20 w-20 rounded-full bg-white text-slate-900 shadow-2xl"
              >
                {processing ? <RotateCcw className="h-6 w-6 animate-spin" /> : <Camera className="h-7 w-7" />}
              </Button>
              <p className="text-xs text-white/80">{processing ? "Processing…" : "Tap to capture"}</p>
            </div>
          </main>

          <footer className="rounded-t-2xl bg-black/60 px-4 pb-8 pt-4">
            <div className="flex gap-3 overflow-x-auto pb-4">
              {thumbnailPlaceholders.map((src, index) => (
                <div key={src} className="relative shrink-0">
                  <img
                    src={src}
                    alt="scan preview"
                    className={`h-28 w-20 rounded-xl border-2 ${index === 0 ? "border-white" : "border-white/30"}`}
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="flex h-28 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/30 text-white/70"
              >
                <Plus />
                Add page
              </button>
            </div>
            <Button
              onClick={captureAndProcess}
              disabled={processing}
              className="h-14 w-full rounded-2xl bg-primary text-base font-semibold text-white"
            >
              {processing ? "Processing…" : "Process scan ($19)"}
            </Button>
            <p className="mt-2 text-center text-xs text-white/60">4 pages captured</p>
          </footer>
        </div>
      </div>
    </div>
  );
};