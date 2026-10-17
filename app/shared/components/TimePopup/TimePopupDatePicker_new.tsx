import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAddReservations } from "@/shared/hooks/mutations/useAddReservations";
import { setRootControl } from "@/slices/RootControlSlice";
import { setShowToast } from "@/slices/HotelServices/HotelServiceSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { usePromotionRedemption } from "@/shared/hooks/usePromotionRedemption";
import TimeDatePicker from '@/shared/components/TimeDatePicker/TimeDatePicker';

const TimePopupDatePicker: React.FC<{ fromCancel?: boolean }> = ({
  fromCancel,
}) => {
  const serviceControl = useSelector(
    (state: any) => state.serviceControl?.serviceControl
  );

  const deviceInfo = JSON.parse(localStorage.getItem("deviceInfo") as string);

  const selectedAlarmDateTime = localStorage.getItem('selectedAlarmDateTime') as string;
  const parsedSelectedAlarmDateTime = JSON.parse(selectedAlarmDateTime) || {};

  const { addReservation } = useAddReservations();
  const { onChangeRedemptionCount } = usePromotionRedemption();
  const dispatch = useDispatch();

  // Helper function to get valid initial time
  const getInitialTime = () => {
    const now = new Date();
    const initialDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7); // Set maximum date to 7 days from now

    // Add 30 minutes to current time
    initialDate.setMinutes(now.getMinutes() + 30);

    // If the time is valid (not past), use it
    if (initialDate > now && initialDate <= maxDate) {
      return {
        hour: initialDate.getHours(),
        minute: initialDate.getMinutes(),
        date: initialDate,
      };
    }

    // If time would be in the past, move to next hour
    initialDate.setHours(now.getHours() + 1);
    initialDate.setMinutes(0);

    return {
      hour: initialDate.getHours(),
      minute: initialDate.getMinutes(),
      date: initialDate,
    };
  };

  const formatMonthDay = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add leading zero
    const day = date.getDate().toString().padStart(2, "0"); // Add leading zero
    return `${day}/${month}`;
  };

  const formatDate = (date: Date) => {
    if (fromCancel) {
      return formatMonthDay(new Date(parsedSelectedAlarmDateTime.date));
    }
    return formatMonthDay(date);
  };

  const getTime = (date: Date) => {
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}:00`;
  };

  const onAddReservation = async (data: any) => {
    try {
      const response = await addReservation(data);

      if (response) {
        dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_CART_ADD));
        dispatch(setShowToast(true));
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const onConfirm = async (fullDate: Date) => {
    if (fromCancel) return;

    let loading = null;
    const departmentUnitId = parseInt(
      localStorage.getItem("departmentUnitId") as string
    );
    const orgId = deviceInfo?.organization?.id;

    const sentService = {
      departmentUnitId,
      orgId,
      serviceId: parseInt(localStorage.getItem("serviceId") as string),
      reservedFrom: getTime(fullDate),
      date: new Date(fullDate).toISOString(),
    };

    loading = true;
    window.dispatchEvent(
      new CustomEvent("onloading", { detail: { loading } })
    );
    await onAddReservation(sentService);
    loading = false;
    window.dispatchEvent(
      new CustomEvent("onloading", { detail: { loading } })
    );
    window.dispatchEvent(new CustomEvent("toastReservation"));

    if (window.fromPromotion) {
      onChangeRedemptionCount(window.fromPromotion.promotionId as string);
    }
  };

  const onOk = (index: number, hour: number, minute: number, date: Date) => {
    if (index === 3) {
      dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP_CLOSE));
    }
  };

  const customEffects = [
    {
      effect: () => {
        window.addEventListener("up", (e: Event) => {
          const { detail } = e as CustomEvent;
          if (detail === "up") {
            dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP));
          }
        });

        return () => {
          window.removeEventListener("up", (e: Event) => {
            const { detail } = e as CustomEvent;
            if (detail === "up") {
              dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES_POPUP));
            }
          });
        };
      },
      dependencies: []
    }
  ];

  const customEventListeners = [
    {
      event: 'confirm',
      handler: async (e: Event) => {
        // This is now handled by onConfirm prop
      }
    }
  ];

  return (
    <TimeDatePicker
      getInitialTime={getInitialTime}
      rootControlActiveValue="popup"
      rootControlId="popup"
      formatDate={formatDate}
      onConfirm={onConfirm}
      onOk={onOk}
      customEffects={customEffects}
      customEventListeners={customEventListeners}
      className={fromCancel ? "select-time-picker" : "date-time-picker"}
      showArrows={!fromCancel}
      minMinutesFromNow={30}
      maxDaysFromNow={7}
    />
  );
};

export default TimePopupDatePicker;
