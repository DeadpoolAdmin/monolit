import React, { useState, useRef, useEffect } from "react";

import { IoCheckmarkCircle, IoCloseCircle, IoMail } from "react-icons/io5";
import type { ToastType, ToastItem } from "@/shared/types/toast/toast.type";
import {
  OrderStatusBackground,
  colors,
} from "@/shared/types/toast/toast.type";
import { MdOutlinePending } from "react-icons/md";

import "@shared/styles/Toast/Toast.scss";
import { Button } from '@/shared/components/Button/Button';
import { useSelector } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFromToast } from "@/slices/Notifications/NotificationSlice";
import { useMarkAsRead } from "@/modules/Notifications/hooks/useMarkAsRead";
import { useTranslate } from "@/shared/hooks/languages/useI18";
import { useToastMessages } from "@/shared/hooks/toast/useToastMessages";

type SingleToastProps = {
  toast: ToastItem;
  onRemove: (id: string) => void;
};

const SingleToast = ({ toast, onRemove }: SingleToastProps) => {
  const [active, setActive] = useState<boolean>(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prevRootControl = useSelector(
    (state: any) => state.rootControl.prevRootControl
  );

  const dispatch = useDispatch();

  const [index, setIndex] = useState<number>(1);

  const navigate = useNavigate();

  const { onMarkAllNotificationsAsRead } = useMarkAsRead();

  const getIconByType = (type: ToastType) => {
    switch (type) {
      case "message":
        return <IoMail style={{ color: colors.BLUE }} />;
      case "alarm":
        return <IoCheckmarkCircle style={{ color: colors.INFO }} />;
      case "order":
        if (toast.status === "PENDING") {
          return (
            <MdOutlinePending
              style={{ color: OrderStatusBackground.PENDING }}
            />
          );
        }
        if (toast.status === "CONFIRMED") {
          return (
            <IoCheckmarkCircle
              style={{ color: OrderStatusBackground.CONFIRMED }}
            />
          );
        }
        if (toast.status === "IN_PROGRESS") {
          return (
            <MdOutlinePending
              style={{ color: OrderStatusBackground.IN_PROGRESS }}
            />
          );
        }
        if (toast.status === "REJECTED") {
          return (
            <IoCloseCircle style={{ color: OrderStatusBackground.REJECTED }} />
          );
        }
        if (toast.status === "FINISHED") {
          return (
            <IoCheckmarkCircle
              style={{ color: OrderStatusBackground.FINISHED }}
            />
          );
        }
        if (toast.status === "CANCELED") {
          return (
            <IoCloseCircle style={{ color: OrderStatusBackground.CANCELED }} />
          );
        }
        if (toast.status === "PAID") {
          return (
            <IoCheckmarkCircle style={{ color: OrderStatusBackground.PAID }} />
          );
        }
        if (toast.status === "READY") {
          return (
            <MdOutlinePending style={{ color: OrderStatusBackground.READY }} />
          );
        }
        if (toast.status === "REJECTED") {
          return (
            <IoCloseCircle style={{ color: OrderStatusBackground.REJECTED }} />
          );
        }
        return <IoCheckmarkCircle style={{ color: colors.INFO }} />;
    }
  };

  const { t } = useTranslate();
  const { getToastMessage } = useToastMessages();

  const isOrderToast = ["ORDER_STATUS_CHANGED"].includes(toast.type);
  const isOrderRejectedToast = ["ORDER_REJECTED", "order_rejected"].includes(
    toast.type
  );
  const isServiceRejectedToast = [
    "SERVICE_REJECTED",
    "SERVICE_RESERVATION_REJECTED",
    "service_rejected",
  ].includes(toast.type);
  const isServiceReservationToast = [
    "SERVICE_RESERVATION_STATUS_CHANGED",
    "service_reservation",
    "service_reservation_status",
  ].includes(toast.type);

  const showToast = () => {
    // Use requestAnimationFrame to ensure the initial state is rendered before transitioning
    requestAnimationFrame(() => {
      setActive(true);
    });

    if (
      !isOrderToast &&
      !isOrderRejectedToast &&
      !isServiceRejectedToast &&
      !isServiceReservationToast
    ) {
      hideTimeoutRef.current = setTimeout(() => {
        setActive(false);
        setTimeout(() => onRemove(toast.id), 300); // Wait for animation to complete
      }, 5000);
    }
  };

  const closeToast = () => {
    dispatch(setRootControl(prevRootControl));

    (window as any).__isToastOrderActive = false;
    window.dispatchEvent(new CustomEvent("toastOrderClosed"));
    setActive(false);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setTimeout(() => onRemove(toast.id), 300);
  };

  useEffect(() => {
    // Small delay to ensure the component is mounted and the initial state is rendered
    const timeoutId = setTimeout(() => {
      showToast();
    }, 10);

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      clearTimeout(timeoutId);
    };
  }, []);

  // Handle case where message might be an object with nested message property
  const message =
    typeof toast.message === "string"
      ? toast.message
      : (toast.message as any)?.message || getToastMessage(toast.type);
  const icon = toast.icon || getIconByType(toast.type);

  useEffect(() => {
    if (
      isOrderToast ||
      isOrderRejectedToast ||
      isServiceRejectedToast ||
      isServiceReservationToast
    ) {
      (window as any).__isToastOrderActive = true;
      window.dispatchEvent(new CustomEvent("toastOrderControl"));
    }
  }, [toast]);

  const onDetails = () => {
    if (isOrderToast || isServiceReservationToast) {
      closeToast();

      let type =
        new URLSearchParams({
          type: isOrderToast || isOrderRejectedToast ? "order" : "reservation",
        }).get("type") || "";

      navigate(`/menu/myorders/${window.__orderId}?type=${type || ""}`);
    } else if (isServiceRejectedToast || isOrderRejectedToast) {

      dispatch(setFromToast(true));

      closeToast();

      navigate("/menu/notifications");
      
    }

    onMarkAllNotificationsAsRead();
  };

  return (
    <div className={`toast ${active ? "active" : ""}`}>
      <div className="toast-content">
        <div className="icon">{icon}</div>
        <div className="message">
          {toast.owner && (
            <div className="owner">
              <span className="text text-2 owner-text">
                {toast.owner.includes("undefined") ? t('frontDesk') : toast.owner}
              </span>
            </div>
          )}
          <span className="text text-2">{t(toast?.title as string) || t(message as string)}</span>
        </div>
        
      </div>
      {(isOrderToast ||
        isOrderRejectedToast ||
        isServiceRejectedToast ||
        isServiceReservationToast) && (
        <div className="toast-action">
          <Button
            className="secondary"
            minWidth="17"
            maxWidth="24"
            style={{
              fontSize: "2.5rem",
              marginRight: "3rem",
              border: ".2rem solid transparent",
              borderColor:
                index === 0
                  ? "var(--active-color, var(--initial-active-color))"
                  : "transparent",
            }}
            isActive={active && index === 0}
            right={() => setIndex(1)}
            ok={closeToast}
          >
            <span className="button-text">{t('close')}</span>
          </Button>

          <Button
            minWidth="17"
            maxWidth="24"
            className="primary"
            style={{
              fontSize: "2.5rem",
              border: ".2rem solid transparent",
              borderColor:
                index === 1
                  ? "var(--active-color, var(--initial-active-color))"
                  : "transparent",
            }}
            isActive={active && index === 1}
            left={() => setIndex(0)}
            ok={onDetails}
          >
            <span className="button-text">{t('viewDetails')}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

type ToastContainerProps = {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
};

export const ToastContainer = ({
  toasts,
  removeToast,
}: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};
