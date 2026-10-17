import React, { useCallback, useEffect, useRef } from "react";

import "./styles/index.scss";
import { useSelector } from "react-redux";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import NavigationText from "./components/NavigationText";
import { useText } from "@/shared/hooks/useGetText";
import WelcomeContent from "./components/Content";
import { Button } from "@/shared/components/Button/Button";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { setSettingsData } from "@/slices/SettingsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetSettingsQuery } from "@/services/Settings/SettingsApi";
import { useGetBranding } from "@/shared/hooks/useGetBranding";
import { useTranslate } from "@/shared/hooks/languages/useI18";
import { setSelectedSound } from "@/slices/Alarm/alarmSlice";
import { useGuestDetails } from "@/shared/hooks/useGuestDetails";
import Loading from "@/shared/components/Loading/Loader";

const Weclome = () => {
  const branding = useSelector((state: any) => state.branding.branding);

  // Get guest details and wait for response before allowing navigation
  const { isSuccess, isLoading, error, guestName } = useGuestDetails();
  
  // Check if we have received a response (either success or error)
  const hasGuestResponse = isSuccess || !!error;

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const { getText } = useText();

  const lang = localStorage.getItem("lang") as string;

  const hasNavigatedRef = useRef<boolean>(false);
  const handleGetCode = useRef<number | NodeJS.Timeout | null>(null);

  const searchParams = usePolyfillSearchParams();

  const { getBrandingData } = useGetBranding();

  const { t } = useTranslate();

  useEffect(() => {
    if (!branding) {
      getBrandingData();
    }
  }, [branding]);

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;
  const { data: settingsData, isLoading: settingsLoading } =
    useGetSettingsQuery(
      {},
      {
        skip:
          localStorage.getItem("showWelcomeScreen") === "false" || !hasToken,
      }
    );

  // const { setBrandingData } = useSetWelcomeShow();

  const dispatch = useDispatch();

  // react refs
  // macrotasks

  // router-dom
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (settingsData && !settingsLoading) {
      dispatch(setSettingsData(settingsData));
    }
  }, [settingsData, settingsLoading]);

  //hotel-smarters-controls
  const controls = {
    id: "welcome-control",
    isActive: location.pathname === "/welcome",
    back: () => {},
  };

  //react useEffect
  useEffect(() => {
    return () => {
      clearTimeout(handleGetCode.current as NodeJS.Timeout);
    };
  }, []);

  const anyKey = {
    ok: () => {
      // Don't navigate if we haven't received a response from guest details yet
      if (!hasGuestResponse && !isLoading) {
        return;
      }
      
      // Preserve all existing URL parameters when navigating to menu
      const search = searchParams.toString();
      navigate(`/menu${search ? `?${search}` : ""}`);
    },
  };

  useEffect(() => {
    // Check if alarm time has passed and clear alarm data
    const selectedAlarmDateTime = localStorage.getItem("selectedAlarmDateTime");

    if (selectedAlarmDateTime) {
      try {
        const alarmData = JSON.parse(selectedAlarmDateTime);
        const { hours, minutes, date } = alarmData;

        // Create alarm date object
        const alarmDate = new Date(date);
        alarmDate.setHours(hours, minutes, 0, 0);

        // Get current time
        const currentTime = new Date();

        // If current time is equal to or past the alarm time, clear alarm data
        if (currentTime >= alarmDate) {
          // Remove localStorage items
          localStorage.removeItem("selectedAlarmDateTime");
          localStorage.removeItem("alarm-img");
          localStorage.removeItem("alarm-sound");

          // Clear Redux state
          dispatch(setSelectedSound(null));

          // Dispatch event to hide the alarm icon
          window.dispatchEvent(new CustomEvent("hideIcon"));
        }
      } catch (error) {
        console.error("Error parsing alarm data:", error);
      }
    }
  }, []);

  const clickAnyKey = useCallback(
    (e: KeyboardEvent) => {
      if (hasNavigatedRef.current) return;
      hasNavigatedRef.current = true;
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch {}
      anyKey.ok();
    },
    [anyKey]
  );



  useEffect(() => {
    // Only add key listener after we have received guest details response
    if (!hasGuestResponse) {
      return;
    }

    // Add a delay to prevent immediate triggering from residual key events
    const timer = setTimeout(() => {
      // Use keyup to avoid key repeat firing on the Menu page after navigation
      window.addEventListener("keyup", clickAnyKey as EventListener, {
        once: true,
      });
    }, 1000); // 500ms delay to ensure page is fully loaded and settled

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keyup", clickAnyKey as EventListener);
    };
  }, [clickAnyKey, hasGuestResponse]);

  if(isLoading) {
    return (
      <Loading />
    )
  }


  return (
    <div
      className="welcome__intro"
      style={{
        backgroundImage: `url(${getUrl(branding?.welcomeScreen?.background)})`,
      }}
    >
      <div className="background" />
      <NavigationText
        subIntroText={getText(branding?.welcomeScreen?.subMessage, lang)}
        introText={getText(branding?.welcomeScreen?.message, "en")}
        introTextFontSize={branding?.headingOne as string}
        subIntroTextFontSize={branding?.headingTwo as string}
        guestName={guestName!}
      />

      <WelcomeContent />

      <div className="welcome__button">
        <Button
          isActive={controls.isActive && hasGuestResponse}
          onClick={anyKey.ok}
          className="primary"
          back={() => {}}
          minWidth="38"
          maxWidth="41"
        >
          <span className="button-text">
            {hasGuestResponse ? t("pressAnyKey") : "Loading..."}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Weclome;
