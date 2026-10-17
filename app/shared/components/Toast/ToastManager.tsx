import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "@/slices/Notifications/NotificationSlice";
import { useGetUnreadCount } from "@shared/hooks/notification/useGetUnreadCount";

const ToastManager: React.FC<{ addToastFromType: any }> = React.memo(({ addToastFromType }) => {
    const location = useLocation();

    const dispatch = useDispatch();
    const { refetchUnreadCount } = useGetUnreadCount();

    // Helper to update unread count and set refetch flag
    const updateNotificationState = () => {
        window.needRefetch = true;
        refetchUnreadCount();
    };

    const updateAlarmDays = () => {
        addToastFromType('alarm');
    };

    const toastProductAdded = () => {
        addToastFromType('product')


        window.needRefetch = true
    }

    const toastRequestAdded = () => {
        addToastFromType('request')

        window.needRefetch = true
    }

    const toastReservationAdded = () => {
        addToastFromType('reservation')

        window.needRefetch = true
    }

    const toastOrderAdded = (e: Event) => {
        const data = (e as CustomEvent).detail.data;


        const obj = {
            status: data?._doc?.status || data?.status || '',
            type: data?._doc?.type || data?.type || ''  ,
            message: data?._doc?.message || data?.message || '',
            updatedAt: data?._doc?.updatedAt || data?.updatedAt || '',
            title: data?._doc?.title || data?.title || ''
        }

        const newData = {
            status: obj?.status || '',
            type: obj?.type || '',
            message: obj?.message || '',
            updatedAt: obj?.updatedAt || '',
            title: obj?.title || '',
            orderId: data?.orderId || data?._doc?.orderId || ''
        }

        addToastFromType('order', newData)
        updateNotificationState();
        window.__orderId = newData.orderId
    }

    const toastServiceReservationAdded = (e: Event) => {
        const data = (e as CustomEvent).detail.data;

        const obj = {
            status: data?._doc?.status || data?.status || '',
            type: data?._doc?.type || data?.type || ''  ,
            message: data?._doc?.message || data?.message || '',
            updatedAt: data?._doc?.updatedAt || data?.updatedAt || '',
            title: data?._doc?.title || data?.title || ''
        }

        const newData = {
            status: obj?.status || '',
            type: obj?.type || '',
            message: obj?.message || '',
            title: obj?.title || '',
            updatedAt: obj?.updatedAt || '',
            orderId: data?.serviceReservationId || data?._doc?.serviceReservationId || ''
        }

        addToastFromType('service_reservation', newData)
        updateNotificationState();
        window.__orderId = newData.orderId
    }

    const toastMessageAdded = (e: Event) => {
        if (location.pathname.includes('messages')) return

        const data = (e as CustomEvent).detail.message;
        addToastFromType('message', { ...data, type: 'message' })
    }

    const toastOrderRejected = (e : Event) => {

        const data = (e as CustomEvent).detail.data;

        const obj = {
            status: data?._doc?.status || data?.status || '',
            type: data?._doc?.type || data?.type || ''  ,
            message: data?._doc?.message || data?.message || '',
            updatedAt: data?._doc?.updatedAt || data?.updatedAt || '',
            title: data?._doc?.title || data?.title || '',
            notificationId: data?._doc?._id || data?._id || ''
        }


        console.log(obj)

        dispatch(setNotification(data?._doc || data));
        addToastFromType('order_rejected', obj)
        updateNotificationState();
    }

    const toastServiceRejected = (e : Event) => {
        const data = (e as CustomEvent).detail.data;

        const obj = {
            status: data?._doc?.status || data?.status || '',
            type: data?._doc?.type || data?.type || ''  ,
            message: data?._doc?.message || data?.message || '',
            updatedAt: data?._doc?.updatedAt || data?.updatedAt || '',
            title: data?._doc?.title || data?.title || '',
            notificationId: data?._doc?._id || data?._id || ''
        }

        dispatch(setNotification(data?._doc || data));
        addToastFromType('service_rejected', obj)
        updateNotificationState();
    }

    useEffect(() => {
        window.addEventListener('toastAlarm', updateAlarmDays);
        window.addEventListener('toastProduct', toastProductAdded);
        window.addEventListener('toastReservation', toastReservationAdded);
        window.addEventListener('toastOrder', toastOrderAdded);
        window.addEventListener('toastServiceReservation', toastServiceReservationAdded);
        window.addEventListener('toastMessage', toastMessageAdded);
        window.addEventListener('toastRequest', toastRequestAdded);
        window.addEventListener('toastOrderRejected', toastOrderRejected);
        window.addEventListener('toastServiceRejected', toastServiceRejected);
        return () => {
            window.removeEventListener('toastAlarm', updateAlarmDays);
            window.removeEventListener('toastProduct', toastProductAdded);
            window.removeEventListener('toastReservation', toastReservationAdded);
            window.removeEventListener('toastOrder', toastOrderAdded);
            window.removeEventListener('toastServiceReservation', toastServiceReservationAdded)
            window.removeEventListener('toastMessage', toastMessageAdded);
            window.removeEventListener('toastRequest', toastRequestAdded);
            window.removeEventListener('toastOrderRejected', toastOrderRejected);
            window.removeEventListener('toastServiceRejected', toastServiceRejected);
        }
    }, [addToastFromType, location]);

    return null;
});

export default ToastManager;