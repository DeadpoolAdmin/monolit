
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useVideoPlayer } from '../../hooks/useLiveTvVideoPlayer';
import { useVideoPlayerControls } from '../../hooks/useVideoPlayerControls';

import { AppPlayer } from '@hotel-smarters/player';
import BasicControl from '../Control/BasicControl';
import { useLazyGetChannelUrlsQuery } from '@/services/Media/Backend/MediaApi';

const LiveTvVideoPlayer = React.memo(() => {
    const chosenChannel = useSelector((state: any) => state.selectedChannel.selectedChannel)

    const visibiltyTimeout = useRef<NodeJS.Timeout | null>(null)

    const controlRef = useRef<HTMLDivElement>(null);

    const { videoRef, onReady, playing, muted } = useVideoPlayer(visibiltyTimeout, controlRef);

    const [getChannelUrls, { isLoading: isChannelUrlsLoading, data: channelUrl }] = useLazyGetChannelUrlsQuery();

    const selectedChannel = useSelector((state: any) => state.selectedChannel.selectedChannel);

    const getChannelUrl = useCallback(async (id: string) => {
        try {
            await getChannelUrls(id)
        } catch (error) {
            console.error(error);       
        }
    }, [getChannelUrls])

    useEffect(() => {
        if(!selectedChannel || selectedChannel.url) return;
        getChannelUrl(selectedChannel.id as string);
    }, [selectedChannel, getChannelUrl])


    const url = useMemo(() => {
        if(chosenChannel?.url){
            return chosenChannel?.url
        }
        else {
            if(!isChannelUrlsLoading && channelUrl) {

                return channelUrl;
            } 
        }

    }, [chosenChannel, channelUrl, isChannelUrlsLoading])


    const { showControlsAndStartTimer } = useVideoPlayerControls(controlRef, visibiltyTimeout);

    useEffect(() => {
        if (window.Android) {
            const liveTv = document.querySelector('.livetv') as HTMLDivElement
            const body = document.querySelector('body') as HTMLBodyElement
            if (liveTv && body) {
                liveTv.style.background = 'transparent'
                body.style.background = 'transparent'
            }
        }
    }, [])

    // Cleanup on unmount - especially important for Android VLC player
    useEffect(() => {
        return () => {
            // Clear timeouts
            if (visibiltyTimeout.current) {
                clearTimeout(visibiltyTimeout.current);
                visibiltyTimeout.current = null;
            }

            // Stop Android player if exists
            if (window.Android && videoRef.current) {
                try {
                    if (videoRef.current.stop) {
                        videoRef.current.stop();
                    }
                } catch (error) {
                    console.error('Error stopping Android player:', error);
                }
            }
        };
    }, [videoRef])

    return (
        <div onClick={showControlsAndStartTimer} style={{
            width: '192rem',
            height: 'var(--screen-height)',
            position: 'absolute',
            top: 0,
            left: 0,
        }}>
            <>
                {url && (
                    <AppPlayer
                        url={url}
                        ref={videoRef}
                        playing={playing}
                        onReady={onReady}
                        loop={false}
                        mediatype='movie'
                        muted={muted}                
                    />
                )}
                <BasicControl ref={controlRef} />
            </>
        </div>
    )
})

export default LiveTvVideoPlayer