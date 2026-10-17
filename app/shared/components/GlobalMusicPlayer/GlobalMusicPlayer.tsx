import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { AppPlayer, PlayerRef } from "@hotel-smarters/player";
import { 
    setIsPlay, 
    setCurrentTime, 
    setDuration, 
    setIsLoading,
    nextTrack,
    previousTrack,
    stopMusic
} from "@/slices/Music/musicSlice";

export const GlobalMusicPlayer = () => {
    const dispatch = useDispatch();
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);
    
    const musicState = useSelector((state: any) => state.music);
    const { 
        isPlay, 
        currentTrack, 
        playlist, 
        musicPlayIndex, 
        isLoading,
        isGlobalPlayerVisible 
    } = musicState;

    const videoRef = useRef<PlayerRef>(null);
    const [playing, setPlaying] = useState(false);

    // Determine if current track is radio based on track data, not location
    const isRadio = useMemo(() => {
        // Radio tracks typically have a 'url' property while music tracks have a 'file' property
        return currentTrack && 'url' in currentTrack && !('file' in currentTrack);
    }, [currentTrack]);

    // Generate URL based on track type (must be before early return)
    const trackUrl = useMemo(() => {
        if (!currentTrack) return undefined;
        
        // Radio tracks have a direct URL
        if (isRadio && 'url' in currentTrack) {
            return currentTrack.url;
        }
        
        // Music tracks need URL generation
        if ('file' in currentTrack) {
            return getUrl(currentTrack.file);
        }
        
        return undefined;
    }, [currentTrack, isRadio, getUrl]);

    // Sync local playing state with Redux
    useEffect(() => {
        setPlaying(isPlay);
    }, [isPlay]);

    // Handle track changes
    useEffect(() => {
        if (currentTrack && isPlay && !isLoading) {
            handlePlay();
        } else if (currentTrack && !isPlay) {
            handlePause();
        }
    }, [currentTrack, musicPlayIndex, isPlay, isLoading]);

    const handlePlay = async () => {
        if (!currentTrack) {
            dispatch(setIsPlay(false));
            return;
        }
        
        // Don't start playing if already loading
        if (isLoading) return;
        
        dispatch(setIsLoading(true));
        try {
            // Handle platform-specific playback
            if ("tizen" in window) {
                const avplay = (window as any).webapis.avplay;
                if (["READY", "PLAYING", "PAUSED"].indexOf(avplay.getState()) > -1) {
                    avplay.play();
                }
            } else if ((window as any).Android) {
                (window as any).Android.play();
            }
            
            // Only set playing state after successful platform call
            setPlaying(true);
            dispatch(setIsPlay(true));
        } catch (error) {
            console.error("Error playing track:", error);
            dispatch(setIsPlay(false));
            setPlaying(false);
        }
    };

    const handlePause = () => {
        setPlaying(false);
        dispatch(setIsPlay(false));
        
        if ("tizen" in window) {
            const avplay = (window as any).webapis.avplay;
            if (["READY", "PLAYING", "PAUSED"].indexOf(avplay.getState()) > -1) {
                avplay.pause();
            }
        } else if ((window as any).Android) {
            (window as any).Android.pause();
        }
    };

    const handleNext = () => {
        if (playlist.length > 0) {
            dispatch(nextTrack());
        }
    };

    const handlePrevious = () => {
        if (playlist.length > 0) {
            dispatch(previousTrack());
        }
    };

    const handleStop = () => {
        handlePause();
        dispatch(stopMusic());
    };

    const onDuration = (duration: number) => {
        dispatch(setDuration(duration));
    };

    const onProgress = (video: any) => {
        const playedSeconds = video.playedSeconds || 0;
        dispatch(setCurrentTime(playedSeconds));
    };

    const onReady = () => {
        dispatch(setIsLoading(false));
        // Ensure play state is correct when track is ready
        if (isPlay && !playing) {
            setPlaying(true);
        }
    };

    const onError = (error: any) => {
        console.error("Music playback error:", error);
        dispatch(setIsLoading(false));
        dispatch(setIsPlay(false));
        setPlaying(false);
    };

    const onEnded = () => {
        // Auto-play next track when current track ends
        if (playlist.length > 1) {
            handleNext();
        } else {
            handleStop();
        }
    };

    // Global event listeners for external control
    useEffect(() => {
        const handleGlobalPlay = () => handlePlay();
        const handleGlobalPause = () => handlePause();
        const handleGlobalNext = () => handleNext();
        const handleGlobalPrevious = () => handlePrevious();
        const handleGlobalStop = () => handleStop();

        // Custom events for global control
        window.addEventListener("globalMusicPlay", handleGlobalPlay);
        window.addEventListener("globalMusicPause", handleGlobalPause);
        window.addEventListener("globalMusicNext", handleGlobalNext);
        window.addEventListener("globalMusicPrevious", handleGlobalPrevious);
        window.addEventListener("globalMusicStop", handleGlobalStop);

        return () => {
            window.removeEventListener("globalMusicPlay", handleGlobalPlay);
            window.removeEventListener("globalMusicPause", handleGlobalPause);
            window.removeEventListener("globalMusicNext", handleGlobalNext);
            window.removeEventListener("globalMusicPrevious", handleGlobalPrevious);
            window.removeEventListener("globalMusicStop", handleGlobalStop);
        };
    }, [currentTrack, playlist]);


    if (!currentTrack || !isGlobalPlayerVisible) {
        return null;
    }

    return (
        <div className="global-music-player" style={{ display: "none" }}>
            <AppPlayer
                url={trackUrl}
                playing={playing}
                ref={videoRef}
                onReady={onReady}
                onDuration={onDuration}
                onProgress={onProgress}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={onEnded}
                onError={onError}
            />
        </div>
    );
};
