import React from "react";
import { useGlobalMusicPlayer } from "@/shared/hooks/useGlobalMusicPlayer";
import { convertTime } from "@/modules/Music/functions/convertTime";

export const GlobalMusicControls = () => {
    const {
        isPlaying,
        currentTrack,
        duration,
        currentTime,
        isLoading,
        isVisible,
        play,
        pause,
        next,
        previous,
        stop,
        setMusicVolume,
        showGlobalPlayer
    } = useGlobalMusicPlayer();

    if (!isVisible || !currentTrack) {
        return null;
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="global-music-controls" style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "15px",
            borderRadius: "10px",
            minWidth: "300px",
            zIndex: 9999
        }}>
            <div className="track-info" style={{ marginBottom: "10px" }}>
                <div style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {currentTrack.name || "Unknown Track"}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {currentTrack.artist || "Unknown Artist"}
                </div>
            </div>

            <div className="progress-bar" style={{
                width: "100%",
                height: "4px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "2px",
                marginBottom: "10px"
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: "100%",
                    background: "var(--primary-button-bg-color, #007bff)",
                    borderRadius: "2px",
                    transition: "width 0.1s"
                }} />
            </div>

            <div className="time-info" style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "10px"
            }}>
                <span>{convertTime(currentTime, duration)}</span>
                <span>{convertTime(duration, duration)}</span>
            </div>

            <div className="controls" style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                alignItems: "center"
            }}>
                <button 
                    onClick={previous}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                >
                    ⏮️
                </button>
                
                <button 
                    onClick={isPlaying ? pause : play}
                    disabled={isLoading}
                    style={{ 
                        background: "none", 
                        border: "none", 
                        color: "white", 
                        cursor: "pointer",
                        fontSize: "20px"
                    }}
                >
                    {isLoading ? "⏳" : isPlaying ? "⏸️" : "▶️"}
                </button>
                
                <button 
                    onClick={next}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                >
                    ⏭️
                </button>
                
                <button 
                    onClick={stop}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
                >
                    ⏹️
                </button>

                <button 
                    onClick={() => showGlobalPlayer(false)}
                    style={{ 
                        background: "none", 
                        border: "none", 
                        color: "white", 
                        cursor: "pointer",
                        marginLeft: "10px"
                    }}
                >
                    ✖️
                </button>
            </div>

            <div className="volume-control" style={{ marginTop: "10px" }}>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>
        </div>
    );
};


