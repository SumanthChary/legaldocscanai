import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Check, RotateCcw, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCameraPermission } from "@/hooks/useCameraPermission";
import { cn } from "@/lib/utils";

interface DocumentScannerProps {
  onScan: (file: File) => void;
  onClose: () => void;
  variant?: "overlay" | "inline";
  autoCloseOnConfirm?: boolean;
  allowImageUpload?: boolean;
}

export const DocumentScanner = ({
  onScan,
  onClose,
  variant = "overlay",
  autoCloseOnConfirm = true,
  allowImageUpload = true,
}: DocumentScannerProps) => {
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { status, requestPermission, isRequesting } = useCameraPermission();
  const isOverlay = variant === "overlay";

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || streamRef.current || status !== "granted") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported in this browser.");
      return;
    }

    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraReady(true);
    } catch (error) {
      console.error("Error accessing camera", error);
      setCameraError("Unable to access camera. Check browser permissions.");
      toast({
        title: "Camera blocked",
        description: "Allow camera access to continue scanning.",
        variant: "destructive",
      });
    }
  }, [status, toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  const handleEnableCamera = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      await startCamera();
    } else {
      setCameraError("Camera permission denied. Update browser settings to continue.");
    }
  }, [requestPermission, startCamera]);

  const captureAndProcess = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) {
      toast({
        title: "Camera not ready",
        description: "Enable the camera before capturing.",
      });
      return;
    }

    setProcessing(true);
    setPendingFile(null);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unsupported");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrast = 1.35;
        const enhanced = Math.min(255, Math.max(0, (gray - 128) * contrast + 128 + 15));
        data[i] = enhanced;
        data[i + 1] = enhanced;
        data[i + 2] = enhanced;
      }
      context.putImageData(imageData, 0, 0);

      setScannedImage(canvas.toDataURL("image/jpeg", 0.95));
      stopCamera();

      toast({
        title: "Scan captured",
        description: "Review the page before sending to analysis.",
      });
    } catch (error) {
      console.error("Error processing scan", error);
      toast({
        title: "Scan failed",
        description: "Something went wrong while processing the scan.",
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
        setPendingFile(null);
        startCamera();
      }
    },
    [autoCloseOnConfirm, onClose, onScan, startCamera],
  );

  const confirmScan = useCallback(() => {
    if (pendingFile) {
      finalizeScan(pendingFile);
      setPendingFile(null);
      setScannedImage(null);
      return;
    }

    if (!scannedImage) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], `scanned-document-${Date.now()}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          finalizeScan(file);
          setScannedImage(null);
        },
        "image/jpeg",
        0.95,
      );
    };

    img.src = scannedImage;
  }, [finalizeScan, pendingFile, scannedImage]);

  const resetScan = useCallback(() => {
    if (scannedImage && scannedImage.startsWith("blob:")) {
      URL.revokeObjectURL(scannedImage);
    }
    setScannedImage(null);
    setPendingFile(null);
    if (status === "granted") {
      startCamera();
    }
  }, [scannedImage, startCamera, status]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (scannedImage && scannedImage.startsWith("blob:")) {
        URL.revokeObjectURL(scannedImage);
      }

      setPendingFile(file);
      setScannedImage(URL.createObjectURL(file));
      stopCamera();
      event.target.value = "";
      toast({
        title: "Photo added",
        description: "Review the image, then send it for analysis.",
      });
    },
    [scannedImage, stopCamera, toast],
  );

  useEffect(() => {
    if (status === "granted" && !streamRef.current && !scannedImage) {
      startCamera();
    }
    if (status !== "granted") {
      stopCamera();
    }
  }, [scannedImage, startCamera, status, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(
    () => () => {
      if (scannedImage && scannedImage.startsWith("blob:")) {
        URL.revokeObjectURL(scannedImage);
      }
    },
    [scannedImage],
  );

  const permissionNeeded = status !== "granted";
  const showPreview = Boolean(scannedImage);
  const containerClass = cn(
    "text-white",
    isOverlay ? "fixed inset-0 z-50 bg-black/95" : "relative rounded-[32px] bg-slate-950 shadow-[0_30px_90px_rgba(0,0,0,0.55)]",
  );

  if (showPreview) {
    return (
      <div className={containerClass}>
        <div className={cn("flex h-full flex-col", !isOverlay && "overflow-hidden")}> 
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <button onClick={onClose} className="text-sm text-white/70">Close</button>
            <p className="instrument-serif-regular-italic text-lg">Review capture</p>
            <button onClick={resetScan} className="text-sm text-emerald-300">Retake</button>
          </header>
          <div className="flex flex-1 items-center justify-center bg-slate-900/60 p-4">
            <img
              src={scannedImage as string}
              alt="Scanned document"
              className="max-h-full w-full rounded-2xl border border-white/10 bg-slate-900 object-contain"
            />
          </div>
          <div className="grid gap-3 border-t border-white/10 p-4 md:grid-cols-2">
            <Button variant="outline" onClick={resetScan} className="border-white/30 text-white">
              <RotateCcw className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button onClick={confirmScan} className="bg-white text-slate-900">
              <Check className="mr-2 h-4 w-4" /> {pendingFile ? "Use photo" : "Use scan"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="flex h-full flex-col gap-4 p-4">
        <header className="flex items-center justify-between text-sm">
          <button onClick={onClose} className="text-white/70">Cancel</button>
          <p className="instrument-serif-regular-italic text-base">Camera scanner</p>
          <span className="text-emerald-300">{status === "granted" ? "Ready" : "Pending"}</span>
        </header>

        <div className="flex-1 rounded-3xl border border-white/10 bg-slate-900/70 p-4">
          {permissionNeeded ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-sm text-white/80">
              <AlertCircle className="mb-3 h-8 w-8 text-amber-400" />
              <p className="font-semibold">Camera permission needed</p>
              <p className="mt-1 text-xs text-white/60">
                Allow LegalDeep to use the camera to scan contracts directly from your device.
              </p>
              <Button
                onClick={handleEnableCamera}
                disabled={isRequesting}
                className="mt-4 rounded-2xl bg-white text-slate-900"
              >
                {isRequesting ? "Requesting..." : "Enable camera"}
              </Button>
            </div>
          ) : (
            <div className="relative flex h-full items-center justify-center">
              <canvas ref={canvasRef} className="hidden" />
              {streamRef.current ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <p className="text-sm text-white/70">Preparing camera...</p>
              )
              }
              <div className="pointer-events-none absolute inset-6 rounded-3xl border border-white/15" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button
            onClick={captureAndProcess}
            disabled={permissionNeeded || processing || !cameraReady}
            className="h-14 w-full rounded-2xl bg-white text-slate-900"
          >
            {processing ? <RotateCcw className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
            {processing ? "Processing scan" : "Capture document"}
          </Button>

          {allowImageUpload && (
            <>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="h-12 w-full rounded-2xl bg-emerald-500 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload from files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
            </>
          )}

          {cameraError && <p className="text-xs text-red-300">{cameraError}</p>}
        </div>
      </div>
    </div>
  );
};