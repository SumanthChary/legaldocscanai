import { useCallback, useEffect, useState } from "react";

type CameraPermissionStatus = "prompt" | "granted" | "denied";

const STORAGE_KEY = "legaldocscanai-camera-permission";

const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";

export function useCameraPermission() {
  const [status, setStatus] = useState<CameraPermissionStatus>("prompt");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") {
      setStatus(stored);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isBrowser || !navigator.mediaDevices?.getUserMedia) {
      setStatus("denied");
      return false;
    }

    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.getTracks().forEach((track) => track.stop());
      setStatus("granted");
      window.localStorage.setItem(STORAGE_KEY, "granted");
      return true;
    } catch (error) {
      console.error("Camera permission error", error);
      setStatus("denied");
      window.localStorage.setItem(STORAGE_KEY, "denied");
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const resetPermissionState = useCallback(() => {
    if (!isBrowser) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setStatus("prompt");
  }, []);

  return {
    status,
    isRequesting,
    requestPermission,
    resetPermissionState,
  };
}
