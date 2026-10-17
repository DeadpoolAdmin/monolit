import React, { useEffect, useMemo } from "react";
import { INotification } from "../types/Notification.type";

import OrderPopupContent from "./OrderPopupContent";
import ServiceReservationPopupContent from "./ServiceReservationPopupContent";
import { setFromToast } from "@/slices/Notifications/NotificationSlice";
import { useDispatch } from "react-redux";

const RejectPopup = ({ data, isOpen, onClose }: { data: INotification, isOpen: boolean, onClose: () => void }) => {
  const isOrderRejected = useMemo(() => {
    return data.type === "ORDER_REJECTED";
  }, [data]);

  const isServiceRejected = useMemo(() => {
    return data.type === "SERVICE_RESERVATION_REJECTED";
  }, [data]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data.rejectedItemsIds.length) {
      document.body.style.setProperty("--popup-height", "180rem");
    } else {
      document.body.style.setProperty("--popup-height", "120rem");
    }
  }, [data]);

  useEffect(() => {
    dispatch(setFromToast(false));
  }, [])

  return (
    <div className="reject__popup" style={{
      padding: "4rem 0",
    }}>
      <div className="reject__popup__content">
        { isOrderRejected ? <OrderPopupContent data={data} onClose={onClose} /> : isServiceRejected ? <ServiceReservationPopupContent data={data} isOpen={isOpen} onClose={onClose} /> : <></> }
      </div>
    </div>
  );
};

export default React.memo(RejectPopup);
