import React from "react";
import { useGlobalMusicPlayer } from "@/shared/hooks/useGlobalMusicPlayer";
import { PMusicItem } from "@/modules/Music/types/music.types";

// Demo component showing how to use the global music player from anywhere
export const GlobalMusicPlayerDemo = () => {
    const { 
        playMusic, 
        isPlaying, 
        currentTrack, 
        playlist, 
        currentIndex,
        duration,
        currentTime,
        play,
        pause,
        next,
        previous,
        stop,
        setMusicVolume,
        showGlobalPlayer
    } = useGlobalMusicPlayer();

    // Example tracks
    const sampleTracks: PMusicItem[] = [
        {
            id: "1",
            name: "Sample Song 1",
            artist: "Artist One",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            file: "",
            image: "",
            title: "Sample Song 1"
        },
        {
            id: "2", 
            name: "Sample Song 2",
            artist: "Artist Two",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            file: "",
            image: "",
            title: "Sample Song 2"
        },
        {
            id: "3",
            name: "Sample Song 3", 
            artist: "Artist Three",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            file: "",
            image: "",
            title: "Sample Song 3"
        }
    ];

    const handlePlayTrack = (track: PMusicItem, index: number) => {
        // This will start playing the track globally
        playMusic(track, sampleTracks, index);
        showGlobalPlayer(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ 
            padding: "20px", 
            background: "#f5f5f5", 
            borderRadius: "10px",
            margin: "20px",
            fontFamily: "Arial, sans-serif"
        }}>
            <h2>🎵 Global Music Player Demo</h2>
            
            {/* Current Status */}
            <div style={{ 
                background: "white", 
                padding: "15px", 
                borderRadius: "8px", 
                marginBottom: "20px",
                border: "1px solid #ddd"
            }}>
                <h3>Current Status</h3>
                <p><strong>Playing:</strong> {isPlaying ? "Yes" : "No"}</p>
                <p><strong>Current Track:</strong> {currentTrack?.name || "None"}</p>
                <p><strong>Artist:</strong> {currentTrack?.artist || "N/A"}</p>
                <p><strong>Track Index:</strong> {currentIndex + 1} of {playlist.length}</p>
                <p><strong>Time:</strong> {formatTime(currentTime)} / {formatTime(duration)}</p>
            </div>

            {/* Track List */}
            <div style={{ marginBottom: "20px" }}>
                <h3>Sample Tracks</h3>
                {sampleTracks.map((track, index) => (
                    <div 
                        key={track.id} 
                        style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            padding: "10px",
                            background: currentTrack?.id === track.id ? "#e3f2fd" : "white",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            marginBottom: "5px"
                        }}
                    >
                        <div>
                            <strong>{track.name}</strong> - {track.artist}
                        </div>
                        <button 
                            onClick={() => handlePlayTrack(track, index)}
                            style={{
                                padding: "5px 15px",
                                background: "#2196f3",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer"
                            }}
                        >
                            {currentTrack?.id === track.id && isPlaying ? "Playing..." : "Play"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ 
                display: "flex", 
                gap: "10px", 
                flexWrap: "wrap",
                marginBottom: "20px"
            }}>
                <button 
                    onClick={previous}
                    disabled={playlist.length === 0}
                    style={{
                        padding: "10px 15px",
                        background: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    ⏮️ Previous
                </button>
                
                <button 
                    onClick={isPlaying ? pause : play}
                    disabled={!currentTrack}
                    style={{
                        padding: "10px 15px",
                        background: isPlaying ? "#f44336" : "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                </button>
                
                <button 
                    onClick={next}
                    disabled={playlist.length === 0}
                    style={{
                        padding: "10px 15px",
                        background: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    ⏭️ Next
                </button>
                
                <button 
                    onClick={stop}
                    disabled={!currentTrack}
                    style={{
                        padding: "10px 15px",
                        background: "#9e9e9e",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    ⏹️ Stop
                </button>
            </div>

            {/* Volume Control */}
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                    <strong>Volume:</strong>
                </label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    style={{ width: "200px" }}
                />
            </div>

            {/* Instructions */}
            <div style={{ 
                background: "#fff3cd", 
                padding: "15px", 
                borderRadius: "8px",
                border: "1px solid #ffeaa7"
            }}>
                <h4>How to Use:</h4>
                <ol>
                    <li>Click "Play" on any track to start playing globally</li>
                    <li>Use the control buttons to manage playback</li>
                    <li>The global music player will appear at the bottom right</li>
                    <li>Music will continue playing even when navigating to other pages</li>
                    <li>You can control the music from anywhere in the app using the <code>useGlobalMusicPlayer</code> hook</li>
                </ol>
            </div>
        </div>
    );
};


