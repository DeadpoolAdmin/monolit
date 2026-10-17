import { INotification } from "@/modules/Notifications/types/Notification.type";

declare global {
    interface Window {
        transforming: boolean;
        tizen: any;
        Android: any;
        WebOS: any;
        webOS: any;
        webOSDevice: any;
        WebOSDevice: any;
        LIVETV_SOURCE: string;
        PLAYLIST_URL: string;
        VOD_SOURCE: string;
        VOD_TYPE: string;
        LIVETV_TYPE: string;
        keyboard_open: boolean;
        fromPromotion: Record<string, unknown> | null;
        __fromNotification: boolean;
        notification: INotification | null;
        needRefetch: boolean;
        __orderId: string;
        keyboardOpen: boolean;
        __fromToast: boolean
    }
}

export {};
