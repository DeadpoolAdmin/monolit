import React, { useCallback, useEffect, useMemo, useState } from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import { INotification } from "../types/Notification.type";
import { Popup } from "@/shared/components/Popup";
import RejectPopup from "./RejectPopup";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setSelectedDates } from "@/slices/ReservationPopup/selected_dates";
import { setNotification } from "@/slices/Notifications/NotificationSlice";
import { useMarkAsRead } from "../hooks/useMarkAsRead";

const NotificationsContent = ({
  notifications,
}: {
  notifications: INotification[];
}) => {
  const [popup, setPopup] = useState<boolean>(false);

  const [popupData, setPopupData] = useState<INotification | null>(null);

  const dispatch = useDispatch();

  const { onMarkAllNotificationsAsRead } = useMarkAsRead();

  const rootControl = useSelector((state: any) => state.rootControl.rootControl);

  const prevRootControl = useSelector((state: any) => state.rootControl.prevRootControl);

  const fromToast = useSelector((state: any) => state.notification.fromToast);

  const notification = useSelector((state: any) => state.notification.notification);

  const showRejectPopup = useCallback((e: Event) => {
    const { detail } = e as CustomEvent<{ data: INotification }>;
    setPopup(true);
    setPopupData(detail.data);
    dispatch(setPrevRootControl(rootControl));

    if(!detail.data.rejectedItemsIds.length) {
      dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE));
    }


  }, [dispatch, rootControl]);


  useEffect(() => {
    onMarkAllNotificationsAsRead();
  }, [onMarkAllNotificationsAsRead]);


  useEffect(() => {
    if(fromToast && notification) {
      setPopup(true);
      setPopupData(notification);
      dispatch(setPrevRootControl(rootControl));
  
      if(!notification.rejectedItemsIds.length) {
        dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE));
      }
    }
  }, [fromToast, notification])


  useEffect(() => {
    window.addEventListener("showRejectPopup", showRejectPopup);

    return () => {
      window.removeEventListener("showRejectPopup", showRejectPopup);
    };
  }, [showRejectPopup]);

  const onClosePopup = useCallback(() => {
    setPopup(false);
    setPopupData(null);
    dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS));
    dispatch(setSelectedDates([]));
    dispatch(setNotification(null));
  }, [dispatch, prevRootControl]);

  const keyboardControls = useMemo(() => ({
    isActive: popup && rootControl !== ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE,
    id: "reject-popup-controls",
    back: onClosePopup,
  }), [popup, onClosePopup, rootControl]);


  return (
    <div className="notification__content">
      <Popup isOpen={popup} onClose={onClosePopup} contentStyle={{ width: "var(--popup-height)"}} keyboardControls={keyboardControls} >
        <RejectPopup isOpen={popup} onClose={onClosePopup} data={popupData as INotification} />
      </Popup>
      <NotificationHeader />
      <NotificationList notifications={notifications} />
    </div>
  );
};

export default NotificationsContent;
