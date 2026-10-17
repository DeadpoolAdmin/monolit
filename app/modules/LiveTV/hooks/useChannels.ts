import { useLazyGetChannelsQuery } from "@/services/Media/Backend/MediaApi";
import { useLazyGetXtreamChannelsQuery } from "@/services/Media/PlaylistApi/PlaylistApi";
import { useCallback, useState, useEffect } from "react";
import { IChannels, IChannelsApi, IXtreamChannels } from "../types/channels.interface";
import { makePlayableLink } from "@/shared/functions/makePlayableLink";


export const useChannels = () => {
    const [getChannels, { isLoading: isChannelsLoading }] = useLazyGetChannelsQuery();
    const [getXtreamChannels, { isLoading: isXtreamChannelsLoading }] = useLazyGetXtreamChannelsQuery();

    const [channels, setChannels] = useState<IChannels[] | IXtreamChannels[]>([]);
    const [sourceReady, setSourceReady] = useState(false);
    const [channelsFetched, setChannelsFetched] = useState(false);


    const getChannelsFromBackend = useCallback(async () => {
        try {
            const response = await getChannels({}).unwrap();

            if (response) {
                setChannels(response)

                const mappedChannels = response.map((channel: IChannelsApi) => {
                    return {
                        icon: channel.image || '',
                        name: channel.title,
                        url: channel.url,
                        number: channel.channelNumber,
                        id: channel._id

                    }
                })

                setChannels(mappedChannels)
            }
            return null
        }
        catch (e) {
            console.log(e)
        }
    }, [getChannels, setChannels])


    const onGetXtreamChannels = useCallback(async () => {
        try {
            const response = await getXtreamChannels({}).unwrap();

            if (response) {
                setChannels(response.map((channel: IXtreamChannels) => {
                    return {
                        icon: channel.stream_icon,
                        name: channel.name,
                        category_id: channel.category_id,
                        id: channel.stream_id, // Use stream_id as the unique ID
                        number: channel.stream_id, // Keep original stream_id as number
                        stream_id: channel.stream_id, // Preserve original stream_id for API calls
                        type: channel.stream_type,
                        url: makePlayableLink(localStorage.getItem('playlist') || '', localStorage.getItem('username') || '', localStorage.getItem('password') || '', channel.stream_id)
                    }
                }))
            }
            return null
        }
        catch (e) {
            console.log(e)
        }
    }, [getXtreamChannels, setChannels])



    const fetchChannels = useCallback(async () => {
        try {
            if (window.LIVETV_SOURCE === 'xtream' || window.LIVETV_SOURCE === 'm3u8') {
                await onGetXtreamChannels();
            } else if(window.LIVETV_SOURCE === 'api') {
                await getChannelsFromBackend();
            }
            setChannelsFetched(true);
        } catch (error) {
            console.error('Error fetching channels:', error);
            setChannelsFetched(true); // Mark as fetched even on error to prevent infinite loading
        }
    }, [onGetXtreamChannels, getChannelsFromBackend]);

    const isLoading = !channelsFetched || (window.LIVETV_SOURCE === 'xtream' || window.LIVETV_SOURCE === 'm3u8' ? isXtreamChannelsLoading : isChannelsLoading);

    // Check for LIVETV_SOURCE availability
    useEffect(() => {
        const checkSource = () => {
            if (window.LIVETV_SOURCE) {
                setSourceReady(true);
                return true;
            }
            return false;
        };

        // Check immediately
        if (checkSource()) return;

        // If not available, check periodically
        const interval = setInterval(() => {
            if (checkSource()) {
                clearInterval(interval);
            }
        }, 50);

        // Cleanup after 5 seconds
        const timeout = setTimeout(() => {
            clearInterval(interval);
            console.warn('window.LIVETV_SOURCE not set after 5 seconds, defaulting to backend');
            setSourceReady(true);
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // Fetch channels when source is ready
    useEffect(() => {
        if (sourceReady) {
            fetchChannels();
        }
    }, [sourceReady, fetchChannels]);

    return {
        channels,
        isChannelsLoading,
        isXtreamChannelsLoading,
        fetchChannels,
        isLoading,
        channelsFetched,
        getChannelsFromBackend,
        onGetXtreamChannels
    }
}