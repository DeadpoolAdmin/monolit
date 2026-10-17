import React, {
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button } from '@/shared/components/Button/Button';
import { Popup } from '@shared/components/Popup';
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setSelectedSound } from "@/slices/Alarm/alarmSlice";
import alarmRingFallback from "@/assets/alarm_ring.png";

import '@shared/styles/Alarm/alarm__popup.scss'

type POpenAlarmPopup = {
  setOpenAlarmPopup: React.Dispatch<SetStateAction<boolean>>;
};

const AlarmPopup: React.FC<POpenAlarmPopup> = memo(({ setOpenAlarmPopup }) => {
  const { getDeviceType } = useResolution();
  const { t } = useTranslation();

  const deviceType = getDeviceType();

  const rootControl = useSelector((state : any) => state.rootControl.rootControl)

  const prevRootControl = useSelector((state : any) => state.rootControl.prevRootControl)

  const dispatch = useDispatch();

  const alarmRing = useMemo(() => {
    return localStorage.getItem("alarm-img") as string;
  }, []);

  const selectedAlarmDateTime = useMemo(() => {
    return JSON.parse(localStorage.getItem("selectedAlarmDateTime") as string);
  }, []);

  // Format the alarm time properly (24-hour to 12-hour format)
  const formattedAlarmTime = useMemo(() => {
    if (!selectedAlarmDateTime) return { time: '', date: '' };
    
    const hours24 = selectedAlarmDateTime.hours;
    const minutes = selectedAlarmDateTime.minutes;
    const alarmDate = selectedAlarmDateTime.date;
    
    // Convert 24-hour to 12-hour format
    const hours12 = hours24 % 12 || 12;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const timeString = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    // Format date (e.g., "Mon Sep 25")
    const dateObj = new Date(alarmDate);
    const dateString = `${dateObj.toLocaleDateString('en-US', {
      weekday: 'short'
    })} ${dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}`;
    
    return { time: timeString, date: dateString };
  }, [selectedAlarmDateTime]);

  useEffect(() => {
    if(rootControl !== ROOT_CONTROL.ALARM_RING_POPUP) {
      dispatch(setPrevRootControl(rootControl))
      dispatch(setRootControl(ROOT_CONTROL.ALARM_RING_POPUP))
    }
  }, [rootControl])


  useEffect(() => {
   localStorage.removeItem("selectedAlarmDateTime")
   localStorage.removeItem('alarm-img');
   localStorage.removeItem('alarm-sound');

   window.dispatchEvent(new CustomEvent("hideIcon"))
  }, [rootControl, prevRootControl])


  const onOk = useCallback(() => {
    setOpenAlarmPopup(false);
    dispatch(setRootControl(prevRootControl))
    const audioElement = document.getElementById(
      "alarm-audio"
    ) as HTMLAudioElement;
    if (audioElement) {
      audioElement.src = '';
    }
    dispatch(setSelectedSound(null));
    window.dispatchEvent(new CustomEvent("hideIcon")) 
    localStorage.removeItem("selectedAlarmDateTime")
    localStorage.removeItem('alarm-img');
    localStorage.removeItem('alarm-sound');
  }, [setOpenAlarmPopup, prevRootControl, dispatch]);

  useEffect(() => {
    const audioElement = document.getElementById(
      "alarm-audio"
    ) as HTMLAudioElement;

    return () => {
      if (audioElement) {
        audioElement.currentTime = 0;
      }
    };
  }, []);

  return (
    <Popup
      isOpen={true}
      closable={false}
      className="alarm__popup"
      contentClassName="popup__content"
      contentStyle={{
        height: deviceType === "TV" ? "70rem" : "70vh",
        width: "150rem"
      }}
    >
      <div className="alarm__icon">
        <img 
          src={alarmRing} 
          alt="Alarm Ringing" 
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
            (e.target as HTMLImageElement).src = alarmRingFallback 
          }} 
        />
      </div>

      <div className="content__title">
        <span>{t("alarmSetFor", { time: formattedAlarmTime.time, date: formattedAlarmTime.date })}</span>
      </div>

      <div className="content__button">
        <Button
          ok={onOk}
          isActive={rootControl == ROOT_CONTROL.ALARM_RING_POPUP}
          style={{
            width: deviceType === "TV" ? "30rem" : "20rem",
            height: deviceType === "TV" ? "8rem" : "6rem",
            fontSize: deviceType === "TV" ? "3rem" : "2.5rem",
            border: "0.2rem solid var(--active-color)",
            minWidth: "38rem"
          }}
        >
          <span>{t("stop")}</span>
        </Button>
      </div>
    </Popup>
  );
});

export default AlarmPopup;
