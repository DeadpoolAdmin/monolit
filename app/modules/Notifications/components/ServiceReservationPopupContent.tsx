import React, { useCallback, useEffect, useMemo } from "react";
import { INotification } from "../types/Notification.type";

import ErrImage from "@assets/smarters.png";

import "smarters-ino-ui-tv/dist/main.css";
import { useDispatch } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector } from "react-redux";
import { useLazyGetReservationByIdQuery } from "@/services/PMS/servicesApi";
import { useText } from "@/shared/hooks/useGetText";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { Button } from '@/shared/components/Button/Button';
import ServiceReservationList from "./ServiceReservationList";
import { Skeleton } from "@shared/components/Skeleton";
import { setSelectedDates } from "@/slices/ReservationPopup/selected_dates";
import { useAddReservations } from "@/shared/hooks/mutations/useAddReservations";
import ButtonLoader from "@/shared/components/ButtonLoader/ButtonLoader";
import { useTranslate } from "@/shared/hooks/languages/useI18";

const ServiceReservationPopupContent = ({
  data,
  onClose,
}: {
  data: INotification;
  isOpen: boolean;
  onClose?: () => void;
}) => {
  const dispatch = useDispatch();

  const { getText } = useText();

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const language = useMemo(() => localStorage.getItem("lang") as string, []);

  const selectedDates = useSelector(
    (state: any) => state.selectedDates.selectedDates
  );

  const { t } = useTranslate();

  const {
    addReservation,
    isLoading: isAddingReservation,
    isSuccess,
  } = useAddReservations();

  const deviceInfoData = useMemo(
    () => JSON.parse(localStorage.getItem("deviceInfo")! || "{}"),
    []
  );

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const [
    getReservationById,
    { isLoading: isReservationLoading, data: reservationData },
  ] = useLazyGetReservationByIdQuery();

  const onGetReservationById = useCallback(async () => {
    if (!data?.serviceReservationId) return;
    try {
      await getReservationById(String(data.serviceReservationId)).unwrap();
    } catch (error) {
      console.error(error);
    }
  }, [getReservationById, data]);

  useEffect(() => {
    onGetReservationById();
  }, [onGetReservationById]);

  useEffect(() => {
    if (data.availableTimeOptions) {
      dispatch(
        setRootControl(ROOT_CONTROL.NOTIFICATIONS_SERVICE_AVAILABLE_TIME)
      );
    }
  }, [data]);

  const onUp = useCallback(() => {
    if(data.availableTimeOptions) {
        dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_SERVICE_AVAILABLE_TIME));
    }
    
  }, [dispatch, data]);

  const onRight = useCallback(() => {
    if(!data.availableTimeOptions) return;
    dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_SERVICE_SEND_REQUEST));
  }, [dispatch]);

  const onLeft = useCallback(() => {
    dispatch(
      setRootControl(ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE)
    );
  }, [dispatch]);

  const fullDate = useMemo(() => {
    if (!selectedDates || selectedDates.length === 0) return null;

    // Find which date it belongs to and create ISO string
    const dateObj = new Date(selectedDates.date);
    const [hours, minutes] = selectedDates.time.split(":");
    dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Convert to ISO string
    return dateObj.toISOString();

    return null;
  }, [selectedDates, data]);

  useEffect(() => {
    if (isSuccess) {
      window.dispatchEvent(new CustomEvent("toastReservation"));
      onClose?.();
    }
  }, [isSuccess]);

  const onSendRequest = useCallback(async () => {
    try {
      if (!selectedDates) return;
      try {
        await addReservation({
          serviceId: data.serviceReservationId,
          departmentUnitId: reservationData?.service?.departmentUnitId,
          date: fullDate,
          reservedFrom: selectedDates.time,
        });

        window.dispatchEvent(new CustomEvent("toastReservation"));
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, selectedDates, reservationData]);

  return (
    <>
      <div className="reject__popup__content__title">
        <span>
          {data.availableTimeOptions ? "Selected Time Unavailable" : data.title}
        </span>
        <br />
      </div>

      <div className="reject__popup__content__description">
        <span>{data.message}</span>
      </div>

      {isReservationLoading ? (
        <div className="reject__popup__reservation">
          <div className="reservation__content">
            <div className="content__left__section">
              <div className="content__image">
                <Skeleton width="15rem" height="15rem" borderRadius="1rem" />
              </div>
              <div className="content__service_title">
                <Skeleton
                  width="20rem"
                  height="2.5rem"
                  style={{ marginBottom: "1rem" }}
                />
                <Skeleton width="15rem" height="2rem" />
              </div>
            </div>

            <div className="content__right__section">
              <Skeleton
                width="12rem"
                height="4rem"
                borderRadius="2rem"
                style={{ marginBottom: "1rem" }}
              />
              <Skeleton width="10rem" height="3rem" />
            </div>
          </div>
        </div>
      ) : reservationData ? (
        <div className="reject__popup__reservation">
          <div className="reservation__content">
            <div className="content__left__section">
              <div className="content__image">
                <img
                  src={getUrl(reservationData?.service?.image)}
                  alt={reservationData?.service?.name}
                  onError={(e: any) => (e.target.src = ErrImage)}
                />
              </div>
              <div className="content__service_title">
                <span>{getText(reservationData?.service?.name, language)}</span>

                <span className="content__service_title__time">
                  <span>
                    {new Date(reservationData?.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>

                  <span
                    style={{
                      marginLeft: "1rem",
                    }}
                  >
                    {reservationData?.reservedFrom
                      ? reservationData.reservedFrom.substring(0, 5)
                      : ""}
                  </span>
                </span>
              </div>
            </div>

            <div className="content__right__section">
              <div
                className={"content__status" + " " + reservationData?.status}
              >
                <span>{reservationData?.status}</span>
              </div>

              <div className="content__price">
                <span>
                  {reservationData?.service?.price}{" "}
                  {deviceInfoData.organization?.currency?.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <ServiceReservationList data={data} />

      <div className="reject__popup__content__reason__button">
        <Button
          minWidth="25"
          maxWidth="30"
          up={onUp}
          ok={() => {
            onClose?.();
            dispatch(setSelectedDates([]));
          }}
          right={onRight}
          isActive={
            rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE
          }
          className={
            "reason__button" +
            (rootControl === ROOT_CONTROL.NOTIFICATIONS_ORDER_TABLE_ORDER_CLOSE
              ? " active"
              : "")
          }
        >
          <span className="button-text">{t('close')}</span>
        </Button>

        {data.availableTimeOptions && (
          <Button
            minWidth="25"
            maxWidth="33"
            up={onUp}
            ok={() => {
              onSendRequest();
            }}
            left={onLeft}
            isActive={
              rootControl === ROOT_CONTROL.NOTIFICATIONS_SERVICE_SEND_REQUEST
            }
            className={
              "primary reason__button" +
              (rootControl === ROOT_CONTROL.NOTIFICATIONS_SERVICE_SEND_REQUEST
                ? " active"
                : "")
            }
          >
            {isAddingReservation ? <ButtonLoader /> : <span className="button-text">Send a Request</span>}
          </Button>
        )}
      </div>
    </>
  );
};

export default React.memo(ServiceReservationPopupContent);
