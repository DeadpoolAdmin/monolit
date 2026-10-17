import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePlatform } from "@/shared/hooks/platform/usePlatform";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import Loading from "../Loading/Loader";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAndroid, isWebOS, isTizen, isWeb } = usePlatform();
  const { getDeviceType } = useResolution();
  const searchParams = usePolyfillSearchParams();

  const [deviceType, setDeviceType] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isTokenInitialized, setIsTokenInitialized] = useState(false);

  const deviceToken =
    searchParams.get("deviceToken") ||
    window.location.search.split("deviceToken=")[1];
    

  // 1️⃣ Wait until deviceType is available
  useEffect(() => {
    const type = getDeviceType();
    if (type) {
      setDeviceType(type);
      setIsReady(true);
    }
  }, [getDeviceType]);

  // 2️⃣ Detect device change (after ready)
  useEffect(() => {
    if (!deviceType) return;
    const prevDeviceType = localStorage.getItem("deviceType");
    if (prevDeviceType && prevDeviceType !== deviceType) {
      console.log(`Device changed from ${prevDeviceType} → ${deviceType}`);
      localStorage.clear();
    }
    localStorage.setItem("deviceType", deviceType);
  }, [deviceType]);

  // 3️⃣ Initialize token from deviceToken (if present)
  useEffect(() => {
    if (!isReady || !deviceType) return;

    // Handle deviceToken initialization
    if (deviceToken) {
      const existingToken = localStorage.getItem("token");
      
      // Only process deviceToken if not already stored OR if different
      if (!existingToken || existingToken !== deviceToken) {
        console.log("Initializing token from deviceToken");
        localStorage.setItem("token", deviceToken);
        // Wait a tick to ensure token is properly stored
        setTimeout(() => {
          setIsTokenInitialized(true);
        }, 0);
        return;
      }
    }
    
    // If no deviceToken or token already exists, mark as initialized
    setIsTokenInitialized(true);
  }, [isReady, deviceType, deviceToken]);

  // 4️⃣ Auth logic runs ONLY when ready AND token is initialized
  useEffect(() => {
    if (!isReady || !deviceType || !isTokenInitialized) return;

    const token = localStorage.getItem("token");
    const isPlatformSupported = isAndroid || isWebOS || isTizen || isWeb;
    const currentPath = location.pathname;

    // ✅ New auth via deviceToken - redirect to languages and clean up URL
    if (deviceToken && token === deviceToken) {
      if (currentPath !== "/languages") {
        console.log("Token initialized, navigating to languages");
        navigate("/languages", { replace: true });
        return;
      }
      
      // If we're on /languages with deviceToken, remove it from URL to allow further navigation
      if (currentPath === "/languages") {
        console.log("On languages page, cleaning up deviceToken from URL");
        // Remove deviceToken from URL without navigation
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        return;
      }
    }

    // ✅ No token
    if (!token) {
      if (currentPath !== "/activate") {
        navigate("/activate");
      }
      return;
    }

    // ✅ Authenticated user
    if (token && isPlatformSupported) {
      if (currentPath === "/" || currentPath === "/activate") {
        console.log("Token exists, navigating to welcome/signage");
        navigate(deviceType === "SIGNAGE" ? "/signage" : "/welcome");
      }
    }
  }, [
    isReady,
    deviceType,
    isTokenInitialized,
    deviceToken,
    location.pathname,
    navigate,
    isAndroid,
    isWebOS,
    isTizen,
    isWeb,
  ]);

  // ⏳ Show loader until ready AND token is initialized
  if (!isReady || !isTokenInitialized) {
    return <Loading />;
  }

  // ⏳ Check if navigation is needed BEFORE rendering (prevents flash of wrong page)
  const token = localStorage.getItem("token");
  const currentPath = location.pathname;
  const isPlatformSupported = isAndroid || isWebOS || isTizen || isWeb;
  
  // Check if we need to navigate (synchronous check before render)
  let shouldShowLoader = false;
  
  // New auth via deviceToken - should navigate to languages
  if (deviceToken && token === deviceToken && currentPath !== "/languages") {
    shouldShowLoader = true;
  }
  
  // No token - should navigate to activate
  if (!token && currentPath !== "/activate") {
    shouldShowLoader = true;
  }
  
  // Has token and on wrong page - should navigate to welcome/signage
  if (token && isPlatformSupported && (currentPath === "/" || currentPath === "/activate")) {
    shouldShowLoader = true;
  }
  
  if (shouldShowLoader) {
    return <Loading />;
  }

  return <>{children}</>;
};
