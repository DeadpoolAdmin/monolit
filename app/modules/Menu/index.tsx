import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { IMenuItem } from "./types/MenuProps";
import { useText } from "@/shared/hooks/useGetText";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { useGetSettingsQuery } from "@/services/Settings/SettingsApi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSettingsData } from "@/slices/SettingsSlice";
import { setRootControl } from "@/slices/RootControlSlice";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useResolution } from "@hotel-smarters/resolution-hook";
import Weather from "@/shared/components/Weather/Waether";
import WelcomeMessage from "./components/WelcomeMessage";

import "./styles/welcome_message.scss";
import MenuList from "./components/MenuList";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useGuestDetails } from "@/shared/hooks/useGuestDetails";
import Loading from "@/shared/components/Loading/Loader";

const Menu = () => {
  const { getText } = useText();
  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST || "");
  const { getDeviceType } = useResolution();

  const keydownCalled = useRef<boolean>(false);

  const lang = localStorage.getItem("lang") as string;
  const deviceType = getDeviceType();

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;
  const { data: settingsData, isLoading: settingsLoading } =
    useGetSettingsQuery({}, { skip: !hasToken });

  const [isMediaAlive, setIsMediaAlive] = React.useState<boolean>(false);

  const { guestName, isLoading } = useGuestDetails();

  const dispatch = useDispatch();

  const rootControl = useSelector(
    (state: any) => state.rootControl?.rootControl
  );

  const isGuestAlive = useSelector(
    (state: any) => state.settingsData.isGuestAlive
  );

  const branding = useSelector((state: any) => state.branding.branding);

  useEffect(() => {
    return () => {
      localStorage.removeItem("movie");
      localStorage.removeItem("movie__link");
      localStorage.removeItem("movies_series");
    };
  }, []);

  useEffect(() => {
    if (settingsData && !settingsLoading) {
      dispatch(setSettingsData(settingsData));
    }
  }, [settingsData, settingsLoading]);

  useEffect(() => {
    window.addEventListener("onPause", () => {
      setIsMediaAlive(false);
    });
    return () => {
      window.removeEventListener("onPause", () => {
        setIsMediaAlive(false);
      });
    };
  }, []);

  const onShowNotification = useCallback(() => {
    dispatch(setRootControl(null));
  }, []);

  const onRootControl = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.MENULIST));
  }, []);

  useEffect(() => {
    if (isGuestAlive) {
      onRootControl();
    }
  }, [onRootControl, isGuestAlive]);

  useEffect(() => {
    if (!(window as any).__isToastOrderActive) {
      dispatch(setRootControl(ROOT_CONTROL.MENULIST));
    }
  }, []);

  useLayoutEffect(() => {
    if ((window as any).__isPromotionActive) {
      onShowNotification();
    }
  }, [onShowNotification]);

  useEffect(() => {
    window.addEventListener("promotionControl", onShowNotification);

    return () => {
      window.removeEventListener("promotionControl", onShowNotification);
    };
  }, [onShowNotification]);

  useEffect(() => {
    window.addEventListener("promotionClosed", onRootControl);

    return () => {
      window.removeEventListener("promotionClosed", onRootControl);
    };
  }, [onRootControl]);

  useEffect(() => {
    const welcome_message = document.querySelector(
      ".welcome__message"
    ) as HTMLElement;

    if (!welcome_message) return;

    if (isMediaAlive) {
      welcome_message.style.top = "-5rem";
    } else {
      welcome_message.style.top = "5rem";
    }
  }, [isMediaAlive]);

  useEffect(() => {
    if (keydownCalled.current) return;
    keydownCalled.current = true;
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      e.preventDefault();
    });
  }, []);

  const controls = {
    isActive: rootControl === "menu-list",
    id: "back-control-menu",
    // back: onBackPress
  };

  useKeydown(controls);

  // if (playlistLoadingByDevice) return <Loading />;

  if (isLoading) {
    return <Loading />;
  }

  return (
    branding && (
      <>
        <div
          className="menu"
          style={{
            background: `url(${getUrl(
              branding?.menuScreen?.background
            )}) no-repeat center`,
            backgroundSize: "cover",
          }}
        >
          <div className="background"></div>

          <div
            className="menu__main"
            style={{
              top: "19rem",
            }}
          >
            {
              <WelcomeMessage
                guestName={guestName!}
                welcome_subMessage={getText(
                  branding?.menuScreen.subMessage
                    ? branding?.menuScreen.subMessage
                    : "",
                  lang
                )}
                welcome__message={getText(
                  branding?.menuScreen.message
                    ? branding?.menuScreen.message
                    : "",
                  lang
                )}
                subMessageFontSize={branding?.headingTwo as string}
                messageFontSize={branding?.headingOne as string}
              />
            }
            <Weather />
          </div>

          {/* {
                    media && (window as any).runningMedia && <BackgroundMusic setMedia={setMedia} media={media} />
                } */}

          {Array.isArray(branding?.menuItems) && (
            <MenuList
              menuItems={branding?.menuItems
                .filter((item: IMenuItem) => {
                  // Filter by visibility
                  if (!item.isVisible) return false;

                  // Filter out music & radio for non-TV devices
                  if (deviceType !== "TV") {
                    const itemType = item.type?.toLowerCase();
                    if (itemType === "music" || itemType === "radio") {
                      return false;
                    }
                  }

                  return true;
                })
                .map((item: IMenuItem) => ({
                  ...item,
                  title: getText(item.title, lang),
                }))}
            />
          )}
        </div>
      </>
    )
  );
};

export default memo(Menu);
