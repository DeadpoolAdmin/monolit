import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applyBrandingStyles } from "./shared/functions/setCssProperty";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { useGetSettingsQuery } from "./services/Settings/SettingsApi";
import { useDispatch } from "react-redux";
import { setSettingsData } from "./slices/SettingsSlice";
import { setPrevRootControl, setRootControl } from "./slices/RootControlSlice";
import { useUpdateDeviceInfo } from "./shared/hooks/useUpdateDeviceInfo";
import { useLocation } from "react-router-dom";
import { useGetBranding } from "./shared/hooks/useGetBranding";
import { GlobalMusicPlayer } from "./shared/components/GlobalMusicPlayer/GlobalMusicPlayer";
import Promotion from "./modules/Promotion";
import { usePromotion } from "./shared/hooks/promotion/usePromotion";
import { useAlarm } from "./shared/hooks/useAlarm";
import AlarmPopup from "./shared/components/AlarmPopup/AlarmPopup";
import AlarmCancelPopup from "./shared/components/AlarmPopup/AlarmCancelPopup";
import { useRelease } from "./shared/hooks/useRelease";
import { useToast } from "./shared/hooks/toast/useToast";
import { ToastContainer } from "./shared/components/Toast/ToastContainer";
import ToastManager from "./shared/components/Toast/ToastManager";
import { useChatSocket } from "./shared/hooks/socket/useChatSocket";
import useSettingsSocket from "./shared/hooks/socket/useSettingsSocket";
import NoGuestPopup from "./shared/components/NoGuestPopup/NoGuestPopup";
import { useXtreamInfo } from "./shared/hooks/playlist/useGetXtreamInfo";
import { useSignageScreens } from "./shared/hooks/signage/useSignageScreens";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { useGetPlaylistByDevice } from "./shared/hooks/playlist/useGetPlaylistByDevice";
import { usePlaylistSettings } from "./shared/hooks/playlist/usePlaylistSettings";
import { useOnUploadPlaylist } from "./shared/hooks/playlist/useOnUploadPlaylist";
import { useOnParsePlaylist } from "./shared/hooks/playlist/useOnParsePlaylist";
import { useDownloadPlaylist } from "./shared/hooks/playlist/useDownloadPlaylist";
import { useOnlineStatus } from "./shared/hooks/online/useOnlineStatus";
import NoInternetConnection from "./shared/components/NoInternetConnection/NoInternetConnection";
import { useResolution } from "@hotel-smarters/resolution-hook";

export const AppContent = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Stabilize token to prevent unnecessary re-renders and query refetches
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isTokenReady, setIsTokenReady] = useState(false);

  const { getBrandingData } = useGetBranding();

  const isOnline = useOnlineStatus();

  const {
    openAlarmPopup,
    setOpenAlarmPopup,
    openAlarmCancelPopup,
    setOpenAlarmCancelPopup,
  } = useAlarm();

  // Initial token readiness check
  useEffect(() => {
    // On mount, if we have a token, mark as ready immediately
    const initialToken = localStorage.getItem("token");
    if (initialToken) {
      console.log("Initial token detected, marking as ready");
      setIsTokenReady(true);
    }
  }, []);

  // Sync token state with localStorage on location changes
  // (storage events don't fire in the same tab)
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken !== token) {
      console.log("Token synced from localStorage:", currentToken ? "present" : "none");
      setToken(currentToken);
      // Mark token as ready when we update it
      if (currentToken) {
        setIsTokenReady(true);
      }
    } else if (currentToken) {
      // Token unchanged but exists - ensure it's marked ready
      setIsTokenReady(true);
    }
  }, [location.pathname, token]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      setIsTokenReady(!!newToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const branding = useSelector((state: any) => state.branding.branding);

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const { data: settings } = useGetSettingsQuery(
    {},
    { skip: location.pathname === "/" || !token || !isTokenReady }
  );

  const dispatch = useDispatch();

  const [isToastOrderActive, setIsToastOrderActive] = useState<boolean>(false);

  const { notify, promotionData } = usePromotion();

  // const deviceInfo = useSelector((state : any) => state.deviceInfo?.deviceInfo)

  const isGuestAlive = useSelector(
    (state: any) => state.settingsData.isGuestAlive
  );

  const isGuestLoaded = useSelector(
    (state: any) => state.settingsData.isGuestLoaded
  );

  const isSignageCalled = useSelector(
    (state: any) => state.signage.isSignageCalled
  );

  const { addToastFromType, toasts, removeToast } = useToast();

  const { connect } = useChatSocket();

  const rootControl = useSelector((state: any) => state.rootControl?.rootControl);


  const deviceInfo = JSON.parse(localStorage.getItem('deviceInfo') as string) || {};


  useEffect(() => {
    if(deviceInfo.organization?.config?.roomControlUrl) {
      localStorage.setItem('roomControlUrl', deviceInfo.organization?.config?.roomControlUrl);
    }
  }, [deviceInfo]);


  useSettingsSocket();

  useXtreamInfo();

  useRelease();

  const { onGetSignageScreens } = useSignageScreens();

  const { updateDeviceInfoData } = useUpdateDeviceInfo();

  // Toast order control callbacks
  const onShowToastOrder = useCallback(() => {
    setIsToastOrderActive(true);
  }, []);

  const onCloseToastOrder = useCallback(() => {
    setIsToastOrderActive(false);
  }, []);


  const searchParams = usePolyfillSearchParams();

  const deviceToken = searchParams.get('deviceToken');

  const deviceInfoFromStore = useSelector((state: any) => state.deviceInfo?.deviceInfo);

  const { onUploadPlaylist } = useOnUploadPlaylist();

  const { onParsePlaylist } = useOnParsePlaylist();

  const { playlistLoading, downloadPlaylist, setPlaylistLoading } =
    useDownloadPlaylist(onUploadPlaylist, onParsePlaylist);


  const prevRootControl = useSelector((state: any) => state.rootControl.prevRootControl);
    
  const {
    playlist,
    onGetPlaylistByDevice,
  } = useGetPlaylistByDevice();

  usePlaylistSettings(onGetPlaylistByDevice, playlist, downloadPlaylist);

  const deviceType = useResolution().getDeviceType();

  useEffect(() => {
    if (playlistLoading) {
      setPlaylistLoading(true);
    } else {
      setPlaylistLoading(false);
    }
  }, [playlistLoading]);

  // Handle toast order active state - save and restore rootControl
  useEffect(() => {
    if (isToastOrderActive) {
      // Close promotion if active
      if ((window as any).__isPromotionActive) {
        window.dispatchEvent(new CustomEvent('hideNotify', { 
          detail: () => {
            // Callback after promotion is hidden
            dispatch(setPrevRootControl(rootControl));
            dispatch(setRootControl(prevRootControl));
          }
        }));
        return;
      }
      
      // Don't save promotion control as previous control
      if (rootControl === 'promotion' || !rootControl) {
        return;
      }
      
      dispatch(setPrevRootControl(rootControl));
      dispatch(setRootControl(null));
    }
  }, [isToastOrderActive, rootControl, dispatch]);

  // Check if toast order is already active on mount
  useLayoutEffect(() => {
    if ((window as any).__isToastOrderActive) {
      onShowToastOrder();
    }
  }, [onShowToastOrder]);

  // Listen to toast order events
  useEffect(() => {
    window.addEventListener("toastOrderControl", onShowToastOrder);
    window.addEventListener("toastOrderClosed", onCloseToastOrder);

    return () => {
      window.removeEventListener("toastOrderControl", onShowToastOrder);
      window.removeEventListener("toastOrderClosed", onCloseToastOrder);
    };
  }, [onShowToastOrder, onCloseToastOrder]);

  useEffect(() => {
    const w = window as any;

    const isAndroid = typeof w.Android !== "undefined";
    const isWebOS = /webOS|web0s/i.test(navigator.userAgent);
    const isTizen = typeof w.tizen !== "undefined";

    // Only clear localStorage once per browser session for non-TV devices
    // This prevents clearing on every component remount which would delete the auth token
    if (!isAndroid && !isWebOS && !isTizen && !deviceToken && deviceType !== 'SIGNAGE') {
      try {
          localStorage.removeItem('token');
      } catch {}
    }
  }, [deviceToken, deviceType]);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    // Skip branding fetch only for root activation page
    if (location.pathname === "/" || !token || !isTokenReady) return;

    if (!branding) {
      console.log("Fetching branding data with token ready");
      getBrandingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branding, location.pathname, token, isTokenReady]);

  useEffect(() => {
   if(location.pathname === '/' || location.pathname === '/activate' || !isTokenReady) return;

   // Only fetch device info if we have a token
   const currentToken = localStorage.getItem('token');
   if(!deviceInfoFromStore && currentToken) {
    console.log('Fetching device info with token');
    updateDeviceInfoData();
   }
  }, [location.pathname, deviceInfoFromStore, updateDeviceInfoData, isTokenReady]);

  useEffect(() => {
    if (settings) {
      localStorage.setItem("wifi", settings.wifiSsid);
      localStorage.setItem("wifiPassword", settings.wifiPassword);

      dispatch(setSettingsData(settings));
    }
  }, [settings]);

  useEffect(() => {
    if (branding) {
      const backgroundUrl = getUrl(branding.background);
      applyBrandingStyles({
        ...branding,
        background: backgroundUrl,
      });
    }
  }, [branding]);

  useLayoutEffect(() => {
    if (!window.keydown) {
      window.keydown = () => {};
    }
  }, []);

  useEffect(() => {
    document.body.style.setProperty(
      "--screen-height",
      window.innerHeight + "px"
    );
  }, [window.innerHeight]);

  useEffect(() => {
    if (!token || isSignageCalled || !branding) return;

    const shouldCheckSignage =
      location.pathname !== "/" &&
      location.pathname !== "/languages" &&
      location.pathname !== "/welcome" &&
      !location.pathname.includes("activate");

    if (shouldCheckSignage && location.pathname === "/signage" && branding) {

      onGetSignageScreens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, location.pathname, isSignageCalled, branding]);

  if(!isOnline) {
    return <NoInternetConnection />;
  }

  return (
    <>
      {children}

      {/* Global Music Player */}
      <GlobalMusicPlayer />

      {/* App Popups */}
      {openAlarmPopup && <AlarmPopup setOpenAlarmPopup={setOpenAlarmPopup} />}
      {openAlarmCancelPopup && (
        <AlarmCancelPopup setOpenAlarmCancelPopup={setOpenAlarmCancelPopup} />
      )}
      {!isGuestAlive &&
        isGuestLoaded &&
        !location.pathname.includes("activate") &&
        location.pathname !== "/languages" &&
        location.pathname !== "/welcome" && <NoGuestPopup />}

      {/* Promotion */}

      {notify && <Promotion data={promotionData} />}

      {/* Toast */}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ToastManager addToastFromType={addToastFromType} />
    </>
  );
};
