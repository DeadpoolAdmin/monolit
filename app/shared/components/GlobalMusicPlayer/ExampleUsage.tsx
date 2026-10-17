import React from "react";
import { useGlobalMusicPlayer } from "@/shared/hooks/useGlobalMusicPlayer";
import { PMusicItem } from "@/modules/Music/types/music.types";

// Example component showing how to use the global music player from anywhere in your app
export const ExampleMusicUsage = () => {
    const { playMusic, isPlaying, currentTrack } = useGlobalMusicPlayer();

    // Example music data
    const sampleTracks: PMusicItem[] = [
        {
            id: "1",
            name: "Sample Song 1",
            artist: "Sample Artist",
            file: "/path/to/song1.mp3",
            url: "https://example.com/song1.mp3"
        },
        {
            id: "2", 
            name: "Sample Song 2",
            artist: "Another Artist",
            file: "/path/to/song2.mp3",
            url: "https://example.com/song2.mp3"
        }
    ];

    const handlePlayTrack = (track: PMusicItem, index: number) => {
        // This will start playing the track globally and show the global player
        playMusic(track, sampleTracks, index);
    };

    return (
        <div className="example-music-usage">
            <h3>Global Music Player Example</h3>
            <p>Current track: {currentTrack?.name || "None"}</p>
            <p>Status: {isPlaying ? "Playing" : "Stopped"}</p>
            
            <div className="track-list">
                {sampleTracks.map((track, index) => (
                    <div key={track.id} className="track-item">
                        <span>{track.name} - {track.artist}</span>
                        <button onClick={() => handlePlayTrack(track, index)}>
                            Play
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Usage examples for different scenarios:

// 1. Play a single track
export const playSingleTrack = (track: PMusicItem) => {
    // Get the hook instance (this would be inside a component)
    // const { playMusic } = useGlobalMusicPlayer();
    // playMusic(track);
};

// 2. Play a playlist starting from a specific track
export const playPlaylist = (playlist: PMusicItem[], startIndex: number = 0) => {
    // const { playMusic } = useGlobalMusicPlayer();
    // playMusic(playlist[startIndex], playlist, startIndex);
};

// 3. Control playback from anywhere using custom events
export const controlMusicGlobally = {
    play: () => window.dispatchEvent(new CustomEvent("globalMusicPlay")),
    pause: () => window.dispatchEvent(new CustomEvent("globalMusicPause")),
    next: () => window.dispatchEvent(new CustomEvent("globalMusicNext")),
    previous: () => window.dispatchEvent(new CustomEvent("globalMusicPrevious")),
    stop: () => window.dispatchEvent(new CustomEvent("globalMusicStop"))
};

// 4. Example of using Redux actions directly (if you have access to dispatch)
/*
import { useDispatch } from "react-redux";
import { playTrack, setIsPlay, nextTrack } from "@/slices/Music/musicSlice";

export const useDirectMusicControl = () => {
    const dispatch = useDispatch();
    
    return {
        playTrack: (track: PMusicItem, playlist?: PMusicItem[], index?: number) => {
            dispatch(playTrack({ track, playlist, index }));
        },
        togglePlay: (isPlaying: boolean) => {
            dispatch(setIsPlay(!isPlaying));
        },
        nextTrack: () => {
            dispatch(nextTrack());
        }
    };
};
*/


