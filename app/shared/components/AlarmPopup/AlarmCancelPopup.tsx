import React, {
  memo,
  SetStateAction,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSelector } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useDispatch } from "react-redux";

import { Button } from "@/shared/components/Button/Button";
import { Popup } from "@shared/components/Popup";
import TimePopupDatePicker from "../TimePopup/TimePopupDatePicker";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { setSelectedSound } from "@/slices/Alarm/alarmSlice";

import "@shared/styles/Alarm/alarm__popup.scss";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const AlarmCancelPopup = ({
  setOpenAlarmCancelPopup,
}: {
  setOpenAlarmCancelPopup: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const dispatch = useDispatch();

  const { t } = useTranslate();

  const onCancelAlarm = useCallback(() => {
    // Stop the audio if it's playing
    const audioElement = document.getElementById(
      "alarm-audio"
    ) as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.src = "";
    }

    // Clear Redux alarm state
    dispatch(setSelectedSound(null));

    // Remove all alarm-related items from localStorage
    localStorage.removeItem("selectedAlarmDateTime");
    localStorage.removeItem("alarm-img");
    localStorage.removeItem("alarm-sound");

    // Close the popup
    setOpenAlarmCancelPopup(false);

    // Dispatch events to hide icon and update alarm system
    window.dispatchEvent(new CustomEvent("hideIcon"));
    window.dispatchEvent(new CustomEvent("updateAlarmDays"));

    // Reset root control
    dispatch(setRootControl(ROOT_CONTROL.MENULIST));
  }, [setOpenAlarmCancelPopup, dispatch]);

  const resechduleAlarm = useCallback(() => {
    setOpenAlarmCancelPopup(false);
    navigate("/menu/alarm");
  }, [setOpenAlarmCancelPopup, navigate]);

  const controls = useMemo(
    () => ({
      isActive: rootControl === "alarmCancelPopup",
      id: "alarm-cancel-popup",
      left: () => {
        if (index !== 0) {
          setIndex(index - 1);
        }
      },
      right: () => {
        if (index !== 1) {
          setIndex(index + 1);
        }
      },
      back: () => {
        setOpenAlarmCancelPopup(false);
      },
    }),
    [rootControl, index, setOpenAlarmCancelPopup]
  );

  useKeydown(controls);

  return (
    <Popup
      isOpen={true}
      closable={true}
      onClose={() => setOpenAlarmCancelPopup(false)}
      keyboardControls={controls}
      className="alarm__popup"
      contentClassName="popup__content"
      contentStyle={{
        height: deviceType === "TV" ? "70rem" : "70vh",
        width: "150rem",
      }}
    >
      <div className="content__title">
        <span>{t("scheduledAlarm")}</span>
      </div>

      <TimePopupDatePicker fromCancel={true} />

      <div className="content__buttons">
        <Button
          minWidth="38"
          maxWidth="41"
          isActive={index === 0 && rootControl === "alarmCancelPopup"}
          ok={onCancelAlarm}
          back={() => {
            setOpenAlarmCancelPopup(false);
            setIndex(0);
            dispatch(setRootControl("menu-list"));
          }}
          style={{
            border: ".2rem solid transparent",
            borderColor:
              deviceType === "TV" &&
              index === 0 &&
              rootControl === "alarmCancelPopup"
                ? "var(--active-color)"
                : "transparent",
          }}
        >
          <span>{t("cancelAlarm")}</span>
        </Button>
        <Button
          minWidth="38"
          maxWidth="41"
          isActive={index === 1 && rootControl === "alarmCancelPopup"}
          ok={resechduleAlarm}
          back={() => {
            setOpenAlarmCancelPopup(false);
            setIndex(0);
            dispatch(setRootControl("menu-list"));
          }}
          style={{
            border: ".2rem solid transparent",
            borderColor:
              deviceType === "TV" &&
              index === 1 &&
              rootControl === "alarmCancelPopup"
                ? "var(--active-color)"
                : "transparent",
          }}
        >
          <span>{t("reschedule")}</span>
        </Button>
      </div>
    </Popup>
  );
};

export default memo(AlarmCancelPopup);
