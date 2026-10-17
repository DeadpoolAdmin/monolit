import React from "react";
import { useSelector } from "react-redux";

const NotificationHeader = () => {
  const unreadCount = useSelector(
    (state: any) => state.notification.unreadCount
  );

  return (
    <div className="notification__content__header">
      <div className="header__title__content">
        <div className="notification__content__header__title">
          Notifications
        </div>
        <div className="notification__content__header__unread">
          {unreadCount > 0 && (
            <span className="notification__content__header__unread__count">
              {unreadCount} new notifications
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NotificationHeader);
