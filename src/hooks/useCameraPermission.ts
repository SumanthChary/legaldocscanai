import { useCallback, useEffect, useRef, useState } from "react";

type CameraPermissionStatus = "prompt" | "granted" | "denied";

const STORAGE_KEY = "legaldocscanai-camera-permission";

const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";

export function useCameraPermission() {
  const [status, setStatus] = useState<CameraPermissionStatus>("prompt");
  const [isRequesting, setIsRequesting] = useState(false);
  const permissionRef = useRef<PermissionStatus | null>(null);

  const mapPermissionState = useCallback((state?: PermissionState | null): CameraPermissionStatus => {
    if (state === "granted") return "granted";
    if (state === "denied") return "denied";
    return "prompt";
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "granted" || stored === "denied") {
      setStatus(stored);
    }

    let isMounted = true;
    const attachPermissionListener = async () => {
      try {
        if (!navigator.permissions?.query) return;
        const permission = await navigator.permissions.query({ name: "camera" as PermissionName });
        permissionRef.current = permission;
        if (!isMounted) return;
        const mapped = mapPermissionState(permission.state);
        setStatus(mapped);
        if (mapped !== "prompt") {
          window.localStorage.setItem(STORAGE_KEY, mapped);
        }
        permission.onchange = () => {
          const nextState = mapPermissionState(permission.state);
          setStatus(nextState);
          if (nextState === "prompt") {
            window.localStorage.removeItem(STORAGE_KEY);
          } else {
            window.localStorage.setItem(STORAGE_KEY, nextState);
          }
        };
      } catch (error) {
        console.error("Camera permission query failed", error);
      }
    };

    attachPermissionListener();

    return () => {
      isMounted = false;
      if (permissionRef.current) {
        permissionRef.current.onchange = null;
      }
    };
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
    if (permissionRef.current) {
      permissionRef.current.onchange = null;
      permissionRef.current = null;
    }
  }, []);

  return {
    status,
    isRequesting,
    requestPermission,
    resetPermissionState,
  };
}
