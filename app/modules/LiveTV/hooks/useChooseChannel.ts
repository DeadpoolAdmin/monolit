import { useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IChannels, IXtreamChannels } from "../types/channels.interface";
import { setSelectedChannel } from "@/slices/LiveTV/selectedChannel";

export const useChooseChannel = (channels: IChannels[] | IXtreamChannels[] = []) => {
    const selectedChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);

    const dispatch = useDispatch();

    const chooseChannel = useCallback((item: IChannels) => {
        dispatch(setSelectedChannel(item));

    }, [dispatch])

    // Memoize the first channel to avoid unnecessary recalculations
    const firstChannel = useMemo(() => {
        return channels.length > 0 ? channels[0] as IChannels : null;
    }, [channels]);

    useEffect(() => {
        if (selectedChannel) return
        if (!firstChannel) return

        dispatch(setSelectedChannel(firstChannel));
    }, [selectedChannel, firstChannel, dispatch])



    // Memoize the return object to prevent unnecessary re-renders
    return useMemo(() => ({
        chosenChannel: selectedChannel,
        chooseChannel,
    }), [selectedChannel, chooseChannel]);
}