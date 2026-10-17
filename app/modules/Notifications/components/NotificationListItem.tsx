import React, { useMemo } from "react";
import { INotification } from "../types/Notification.type";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { colors } from "@/shared/types/toast/toast.type.ts";
import { formatDate } from "@/shared/functions/orderDate";
import { FaChevronRight } from "react-icons/fa";
import { TbPointFilled } from "react-icons/tb";
import { useTranslate } from "@shared/hooks/languages/useI18";
import { getLocale } from "@/shared/functions/getLocale";
import { useText } from "@/shared/hooks/useGetText";

interface NotificationListItemProps {
  notification: INotification;
  style: React.CSSProperties;
  isActive: boolean;
  onClick: (notification: INotification) => void;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({
  notification,
  style,
  isActive,
  onClick,
}) => {
  const { t, language } = useTranslate();


  const { getText } = useText();

  const iconType = useMemo(() => {
    if (["ORDER_REJECTED", "SERVICE_RESERVATION_REJECTED"].includes(notification.type)) {
      return "close";
    } else if (
      ["ORDER_STATUS_CHANGED", "SERVICE_RESERVATION_STATUS_CHANGED"].includes(
        notification.type
      )
    ) {
      return "checkmark";
    }
    return "checkmark"; // default
  }, [notification.type]);

  

  return (
    <div
      onClick={() => onClick(notification)}
      className={`notification__list__item ${isActive ? "active" : ""}`}
      style={style}
    >
      <div className="list_item__content">
        <div className="image__message">
          <div className="list_item__image">
            {
              !notification.isRead && (
                <TbPointFilled style={{ color: colors.INFO }} />
              )
            }
            {iconType === "close" ? (
              <IoCloseCircle style={{ color: colors.RED }} />
            ) : (
              <IoCheckmarkCircle style={{ color: colors.SUCCESS }} />
            )}
          </div>
          <div className="list_item__text">
            <div className="list_item__text__title">
              <span>{getText(notification.title, language)}</span>
            </div>
          </div>
        </div>

        <div className="time__details">
            <span className="time__details__time">{formatDate(new Date(notification.createdAt), true, getLocale(language))}</span>
            <span className={`notification__detail__button ${isActive ? 'active' : ''}`}>
                <span>{t('viewDetails')}</span>
                <FaChevronRight style={{marginLeft: '1rem'}}/>
            </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NotificationListItem);
