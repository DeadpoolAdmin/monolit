import { useSetActionStatusMutation } from "@/services/RoomControl/RoomControlApi";
import { useCallback } from "react";

export const useOnSetActionStatus = () => {
    const [setActionStatus] = useSetActionStatusMutation();

    const onSetActionStatus = useCallback(async (action: string, value: boolean | number) => {
        try {
            await setActionStatus({ action, value });
        }
        catch(error) {
            console.log(error);
        }
    }, [setActionStatus]);

    return { onSetActionStatus };
}