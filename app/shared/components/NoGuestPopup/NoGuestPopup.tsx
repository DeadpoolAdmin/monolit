import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Popup } from "@shared/components/Popup";
import { setRootControl } from "@/slices/RootControlSlice";

import "@shared/styles/NoGuestPopup/NoGuestPopup.scss";

const NoGuestPopup = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const BlockContent = () => {
    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: `1. ${t("openRoomsTab")}` }} />
        {" "}
        <br />
        <span>{`2. ${t("locateRoomAssigned")}`}</span> <br />
        <span dangerouslySetInnerHTML={{ __html: `3. ${t("clickCheckInButton")}` }} />
        {" "}
        <br />
        <span dangerouslySetInnerHTML={{ __html: `4. ${t("enterGuestDetails")}` }} />
        {" "}
        <br />
        <span>{`5. ${t("waitFewSeconds")}`}</span>
      </>
    );
  };

  useEffect(() => {
    dispatch(setRootControl(null));
  }, [dispatch]);

  return (
    <Popup
      isOpen={true}
      closable={false}
      width="162rem"
      height="90rem"
      className="no-guest-popup"
      contentClassName="no-guest-popup__content"
      showOverlay={true}
      overlayOpacity={0.5}
    >
      <div className="content__title">
        <span>{t("welcome")}</span>
      </div>
      <div className="content__subtitle">
        <span>{t("noGuestAssigned")}</span>{" "}
        <br />
        <span>
          {t("providePersonalizedExperience")}
        </span>
      </div>

      <div className="content__mini__block">
        <div className="content__mini__block__title">
          <span>{t("whatYouCanDo")}</span>
        </div>

        <div className="content__mini__block__content">
          <BlockContent />
        </div>
      </div>
    </Popup>
  );
};

export default NoGuestPopup;
