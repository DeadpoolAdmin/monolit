import { useResolution } from "@hotel-smarters/resolution-hook";
import React, { useCallback, useMemo, useState } from "react";

import { ListView } from "smarters-ino-ui-tv";
import ScrollView from "@/shared/components/ScrollView/ScrollView";
import "smarters-ino-ui-tv/dist/main.css";
import { INotification } from "../types/Notification.type";
import NotificationListItem from "./NotificationListItem";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useNavigate } from "react-router-dom";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useDispatch } from "react-redux";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";

const NotificationList = ({
  notifications,
}: {
  notifications: INotification[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const deviceType = useResolution().getDeviceType();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onUp = useCallback(() => {
    dispatch(setPrevRootControl(rootControl));
    dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    
  }, [dispatch, rootControl]);

  const controls = useMemo(
    () => ({
      id: "notification-list-controls",
      isActive: rootControl === ROOT_CONTROL.NOTIFICATIONS,
      back: () => {
        if (activeIndex === 0) {
          navigate("/menu");
        } else {
          setActiveIndex(0);
        }
      },
    }),
    [rootControl, activeIndex, navigate, dispatch]
  );

  useKeydown(controls);

  const onOk = useCallback(
    async(item: INotification) => {
      try {
        switch (item.type) {
          case "ORDER_REJECTED":
            window.dispatchEvent(
              new CustomEvent("showRejectPopup", {
                detail: { data: item },
              })
            );
            break;
          case "SERVICE_RESERVATION_REJECTED":
            window.dispatchEvent(
              new CustomEvent("showRejectPopup", {
                detail: { data: item },
              })
            );
            break;

          case "ORDER_STATUS_CHANGED":

            navigate(`/menu/myorders/${item.orderId}`);
            break;
          case "SERVICE_RESERVATION_STATUS_CHANGED":
            navigate(
              `/menu/myorders/${item.serviceReservationId}?type=reservation`
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [navigate]
  );

  return (
    <div className="notification__list" style={{
      overflow: deviceType === "TV" ? "hidden" : "auto",
      scrollbarWidth: "none",
      height: deviceType === "TV" ? "100%" : "75%",
    }}>
      {deviceType === "TV" ? (
        <ListView
          data={notifications}
          id="cart"
          uniqueKey="cart"
          listType="vertical"
          nativeControle={true}
          itemsCount={6}
          itemsTotal={notifications.length}
          buffer={5}
          itemWidth={175}
          itemHeight={18}
          gap={3.5}
          isActive={rootControl === ROOT_CONTROL.NOTIFICATIONS}
          onUp={onUp}
          initialActiveIndex={0}
          onBackScrollIndex={null}
          startScrollIndex={0}
          direction="ltr"
          rowGap={3.5}
          activeIndex={activeIndex}
          onIndexChange={(index) => {
            setActiveIndex(index);
          }}
          onOk={onOk}
          onLeft={() => {}}
          onRight={() => {}}
          renderItem={({ item, style, isActive, key }) => (
            <NotificationListItem
              key={key}
              style={style}
              isActive={isActive}
              notification={item as unknown as INotification}
              onClick={() => onOk(item as unknown as INotification)}
            />
          )}
        />
      ) : (
        <ScrollView
          data={notifications}
          width={175}
          dimension={"vh"}
          listType={"grid"}
          type={"gird-movies"}
          renderItem={({ item, style, isActive, key }) => (
            <NotificationListItem
              key={key}
              style={{
                ...style,
                width: "175rem",
                height: "18rem",
                margin: "1rem 0",
              }}
              isActive={isActive}
              notification={item as unknown as INotification}
              onClick={() => onOk(item as unknown as INotification)}
            />
          )}
        />
      )}
    </div>
  );
};

export default React.memo(NotificationList);
