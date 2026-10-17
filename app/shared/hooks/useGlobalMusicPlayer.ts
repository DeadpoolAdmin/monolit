import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { 
    playTrack, 
    setIsPlay, 
    nextTrack, 
    previousTrack, 
    stopMusic,
    setVolume,
    setGlobalPlayerVisible,
    setPlaylist,
    setPlayError,
    syncPlayState
} from "@/slices/Music/musicSlice";
import { PMusicItem } from "@/modules/Music/types/music.types";

export const useGlobalMusicPlayer = () => {
    const dispatch = useDispatch();
    const musicState = useSelector((state: any) => state.music);

    // Play a specific track with optional playlist
    const playMusic = useCallback((track: PMusicItem, playlist?: PMusicItem[], index?: number) => {
        dispatch(playTrack({ track, playlist, index }));
    }, [dispatch]);

    // Play/pause toggle
    const togglePlayPause = useCallback(() => {
        dispatch(setIsPlay(!musicState.isPlay));
    }, [dispatch, musicState.isPlay]);

    // Play current track
    const play = useCallback(() => {
        if (musicState.currentTrack && !musicState.isLoading) {
            dispatch(setIsPlay(true));
            // Dispatch custom event for global control
            window.dispatchEvent(new CustomEvent("globalMusicPlay"));
        }
    }, [dispatch, musicState.currentTrack, musicState.isLoading]);

    // Pause current track
    const pause = useCallback(() => {
        dispatch(setIsPlay(false));
        // Dispatch custom event for global control
        window.dispatchEvent(new CustomEvent("globalMusicPause"));
    }, [dispatch]);

    // Next track
    const next = useCallback(() => {
        dispatch(nextTrack());
        // Dispatch custom event for global control
        window.dispatchEvent(new CustomEvent("globalMusicNext"));
    }, [dispatch]);

    // Previous track
    const previous = useCallback(() => {
        dispatch(previousTrack());
        // Dispatch custom event for global control
        window.dispatchEvent(new CustomEvent("globalMusicPrevious"));
    }, [dispatch]);

    // Stop music
    const stop = useCallback(() => {
        dispatch(stopMusic());
        // Dispatch custom event for global control
        window.dispatchEvent(new CustomEvent("globalMusicStop"));
    }, [dispatch]);

    // Set volume
    const setMusicVolume = useCallback((volume: number) => {
        dispatch(setVolume(volume));
    }, [dispatch]);

    // Show/hide global player
    const showGlobalPlayer = useCallback((show: boolean) => {
        dispatch(setGlobalPlayerVisible(show));
    }, [dispatch]);

    return {
        // State
        musicState,
        isPlaying: musicState.isPlay,
        currentTrack: musicState.currentTrack,
        playlist: musicState.playlist,
        currentIndex: musicState.musicPlayIndex,
        volume: musicState.volume,
        duration: musicState.duration,
        currentTime: musicState.currentTime,
        isLoading: musicState.isLoading,
        isVisible: musicState.isGlobalPlayerVisible,

        // Actions
        playMusic,
        play,
        pause,
        togglePlayPause,
        next,
        previous,
        stop,
        setMusicVolume,
        showGlobalPlayer,
        
        // Additional helpers
        setPlaylist: (playlist: PMusicItem[]) => {
            dispatch(setPlaylist(playlist));
        },
        syncState: () => {
            dispatch(syncPlayState());
        },
        handleError: (error: string) => {
            dispatch(setPlayError(error));
        }
    };
};
