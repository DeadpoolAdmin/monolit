import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PMusicItem } from "@/modules/Music/types/music.types";

export interface MusicState {
    isPlay: boolean;
    musicPlayIndex: number;
    prevCategory: null | string;
    currentTrack: PMusicItem | null;
    playlist: PMusicItem[];
    volume: number;
    duration: number;
    currentTime: number;
    isLoading: boolean;
    isGlobalPlayerVisible: boolean;
}

const initialState: MusicState = {
    isPlay: false,
    musicPlayIndex: 0,
    prevCategory: null,
    currentTrack: null,
    playlist: [],
    volume: 1,
    duration: 0,
    currentTime: 0,
    isLoading: false,
    isGlobalPlayerVisible: false
};

const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setIsPlay: (state, action: PayloadAction<boolean>) => {
            state.isPlay = action.payload;
        },
        setMusicPlayIndex: (state, action: PayloadAction<number>) => {
            state.musicPlayIndex = action.payload;
        },
        setPrevCategory: (state, action: PayloadAction<string | null>) => {
            state.prevCategory = action.payload;
        },
        setCurrentTrack: (state, action: PayloadAction<PMusicItem | null>) => {
            state.currentTrack = action.payload;
        },
        setPlaylist: (state, action: PayloadAction<PMusicItem[]>) => {
            state.playlist = action.payload;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = Math.min(Math.max(action.payload, 0), 1);
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setGlobalPlayerVisible: (state, action: PayloadAction<boolean>) => {
            state.isGlobalPlayerVisible = action.payload;
        },
        playTrack: (state, action: PayloadAction<{ track: PMusicItem; playlist?: PMusicItem[]; index?: number }>) => {
            const { track, playlist, index } = action.payload;
            
            // Reset loading and error states
            state.isLoading = true;
            state.currentTime = 0;
            
            // Set track and playlist
            state.currentTrack = track;
            state.isGlobalPlayerVisible = true;
            
            if (playlist) {
                state.playlist = playlist;
            }
            if (index !== undefined) {
                state.musicPlayIndex = index;
            }
            
            // Set play state after track is set
            state.isPlay = true;
        },
        nextTrack: (state) => {
            if (state.playlist.length > 0) {
                const nextIndex = (state.musicPlayIndex + 1) % state.playlist.length;
                state.musicPlayIndex = nextIndex;
                state.currentTrack = state.playlist[nextIndex];
                state.isLoading = true;
                state.currentTime = 0;
                // Keep playing state if was playing
                if (state.isPlay) {
                    state.isPlay = true;
                }
            }
        },
        previousTrack: (state) => {
            if (state.playlist.length > 0) {
                const prevIndex = (state.musicPlayIndex - 1 + state.playlist.length) % state.playlist.length;
                state.musicPlayIndex = prevIndex;
                state.currentTrack = state.playlist[prevIndex];
                state.isLoading = true;
                state.currentTime = 0;
                // Keep playing state if was playing
                if (state.isPlay) {
                    state.isPlay = true;
                }
            }
        },
        stopMusic: (state) => {
            state.isPlay = false;
            state.currentTime = 0;
            state.isLoading = false;
            state.isGlobalPlayerVisible = false;
        },
        // Add action to handle loading errors
        setPlayError: (state) => {
            state.isPlay = false;
            state.isLoading = false;
        },
        // Add action to sync play state when navigation occurs
        syncPlayState: (state) => {
            // This ensures UI stays in sync when navigating
            if (!state.currentTrack) {
                state.isPlay = false;
                state.isLoading = false;
            }
        }
    }
});

export const { 
    setIsPlay, 
    setMusicPlayIndex, 
    setPrevCategory,
    setCurrentTrack,
    setPlaylist,
    setVolume,
    setDuration,
    setCurrentTime,
    setIsLoading,
    setGlobalPlayerVisible,
    playTrack,
    nextTrack,
    previousTrack,
    stopMusic,
    setPlayError,
    syncPlayState
} = musicSlice.actions;

export default musicSlice.reducer;