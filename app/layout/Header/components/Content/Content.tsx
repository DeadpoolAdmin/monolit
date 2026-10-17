import React, { useEffect, useMemo } from "react";
import HeaderContentProps from "@layout/Header/types/header.interface";
import { ROUTE_PATHS } from "@/shared/types/date/date";
import { useLocation } from "react-router-dom";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import Back from "../Back/Back";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useClickBack } from "../../hooks/useClickBack";
import Search from "../Search/Search";
import { useResolution } from "@hotel-smarters/resolution-hook";

const HeaderContent: React.FC<HeaderContentProps> = ({ logo }) => {
  const paths = useMemo(() => {
    return ROUTE_PATHS;
  }, []);

  const location = useLocation();

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST!);

  const rootControl = useSelector((state: any) => state.rootControl.rootControl)

  const { clickBack } = useClickBack();

  const deviceType = useResolution().getDeviceType();

  useEffect(() => {
    window.addEventListener('clickBack', clickBack)

    return () => {
      window.removeEventListener('clickBack', clickBack)
    }
  }, [])

  const movieConditions = useMemo(() => {
    return {
      tv: !location.pathname.includes('vod/') && !location.pathname.includes('player') && deviceType === 'TV',
      tablet: !location.pathname.includes('player') && deviceType === 'TABLET'
    }
  }, [location.pathname, deviceType])

  return (
    <div
      style={{
        position: "relative",
        zIndex: 6,
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {
        location.pathname !== paths.MENU && location.pathname !== paths.WELCOME && (movieConditions.tv || movieConditions.tablet) && (
          <Back
            onClick={clickBack}
            isActive={rootControl === ROOT_CONTROL.HEADER_BACK}
          />
        )
      }
      
      {
        location.pathname === paths.VOD && (
          <Search
            
          />
        )
      }

      {(location.pathname === paths.MENU ||
        location.pathname === paths.WELCOME) && (
        <div
          className="header__logo"
          style={{
            position: "relative",
            left: "2rem",
            maxWidth: "31rem",
            width: "auto",
            height: "8rem",
          }}
        >
          <img
            src={getUrl(logo)}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            alt=""
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "left",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderContent;
