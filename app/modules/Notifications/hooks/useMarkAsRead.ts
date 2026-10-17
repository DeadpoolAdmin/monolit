import { useMarkAllNotificationsAsReadMutation, useMarkNotificationAsReadMutation } from "@/services/Notifications/notificationsApi";
import { useCallback } from "react";

export const useMarkAsRead = () => {
    const [markNotificationAsRead, { isLoading: isMarkingNotificationAsReadLoading, data: notificationAsReadData }] = useMarkNotificationAsReadMutation();
    const [markAllNotificationsAsRead, { isLoading: isMarkingAllNotificationsAsReadLoading, data: allNotificationsAsReadData }] = useMarkAllNotificationsAsReadMutation();

    const onMarkNotificationAsRead = useCallback(async (id: string) => {

        try {
            await markNotificationAsRead(id).unwrap();

        }
        catch (error) {
            console.log(error);
        }
        
    }, [markNotificationAsRead]);

    const onMarkAllNotificationsAsRead = useCallback(async () => {
        try {
            await markAllNotificationsAsRead(undefined).unwrap();
        }
        catch (error) {
            console.log(error);
        }
    }, [markAllNotificationsAsRead]);
    

    return { onMarkNotificationAsRead, onMarkAllNotificationsAsRead, isMarkingNotificationAsReadLoading, isMarkingAllNotificationsAsReadLoading, notificationAsReadData, allNotificationsAsReadData };
}