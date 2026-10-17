import { useLazyGetUnreadCountQuery } from "@/services/Notifications/notificationsApi";
import { useEffect } from "react";

export const useGetUnreadCount = () => {
    const [getUnreadCount, { isLoading, isError, error, data: unreads }] = useLazyGetUnreadCountQuery();

    const onGetUnreadCount = async () => {
        try {
            const response = await getUnreadCount(undefined).unwrap();
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        onGetUnreadCount();
    }, []);

    return { unreads, isLoading, isError, error, refetchUnreadCount: onGetUnreadCount };
}