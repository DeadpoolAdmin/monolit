import { useTranslate } from "@/shared/hooks/languages/useI18";
import { ToastType } from "@/shared/types/toast/toast.type";

export const useToastMessages = () => {
    const { t } = useTranslate();

    const getToastMessage = (type: ToastType): string => {
        const messageMap: Record<ToastType, string> = {
            message: t('newMessageReceived'),
            order: t('orderStatusUpdated'),
            order_rejected: t('orderHasBeenRejected'),
            alarm: t('alarmIsSetSuccessfully'),
            product: t('orderSubmittedWeWillStartProcessing'),
            reservation: t('reservationConfirmedWeLookForward'),
            request: t('requestReceivedWeWillProcess'),
            reservation_status: t('reservationStatusUpdated'),
            order_canceled: t('orderHasBeenCanceled'),
            order_pending: t('yourOrderIsPendingConfirmation'),
            order_ready: t('yourOrderIsReadyForPickup'),
            order_paid: t('paymentSuccessfulOrderConfirmed'),
            service_rejected: t('serviceHasBeenRejected'),
        };

        return messageMap[type] || '';
    };

    const getOrderActionMessage = (action: string): string => {
        const actionMap: Record<string, string> = {
            PRODUCT_ADDED: t('productAddedToYourOrder'),
            RESERVATION_ADDED: t('reservationAddedToYourOrder'),
            MULTIPLE_PRODUCTS: t('itemsAddedToYourOrder'),
            VIP_RESERVATION: t('vipReservationAddedToYourOrder'),
            CHECKOUT_COMPLETE: t('orderCheckoutCompleted'),
            MODIFICATION_MADE: t('orderModificationCompleted'),
        };

        return actionMap[action] || '';
    };

    return {
        getToastMessage,
        getOrderActionMessage,
    };
};

