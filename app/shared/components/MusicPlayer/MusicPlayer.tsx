import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { AppPlayer, PlayerRef } from "@hotel-smarters/player";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { PMusicItem } from "@/modules/Music/types/music.types";
import { convertTime } from "@/modules/Music/functions/convertTime";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

const MusicPlayer = ({
  musicIndex,
  musics,
  onPlayingChange,
}: {
  musicIndex: number;
  setMusicIndex: (index: number) => void;
  musics: PMusicItem[];
  onPlayingChange?: (playing: boolean) => void;
}) => {

  const durationRef = useRef<HTMLSpanElement>(null);

  const progressRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const location = useLocation();

  const [playing, setPlaying] = useState(false);

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const videoRef = useRef<PlayerRef>(null);

  const [duration, setDuration] = useState(0);

  const rootControl = useSelector((state: any) => state.rootControl.rootControl);

  // Removed unused refs

  const onDuration = (duration: number) => {
    console.log("duration", duration);
    setDuration(duration); // This line is missing!
  };

  const onReady = () => {
    // onReady should wait for duration to be set via onDuration
    // or receive the duration as a parameter
    if (durationRef.current && duration > 0) {
      durationRef.current.textContent = convertTime(duration, duration);
    }
  };

  const onPlay = () => {
    setPlaying(true);
    onPlayingChange?.(true);

    if ("tizen" in window) {
      if (
        ["READY", "PLAYING", "PAUSED"].indexOf(
          (window as any).webapis.avplay.getState()
        ) > -1
      ) {
        (window as any).webapis.avplay.play();
      }

      return;
    }

    if ((window as any).Android) {
      (window as any).Android.play();
      return;
    }
  };

  const onPause = () => {
    setPlaying(false);
    onPlayingChange?.(false);

    if ("tizen" in window) {
      if (
        ["READY", "PLAYING", "PAUSED"].indexOf(
          (window as any).webapis.avplay.getState()
        ) > -1
      ) {
        (window as any).webapis.avplay.pause();
      }

      return;
    }

    if ((window as any).Android) {
      (window as any).Android.pause();
    }
  };

  const onPlayOrPause = () => {
    if (playing) {
      onPause();
    } else {
      onPlay();
    }
  };

  // Removed unused setSeekTime function

  const onProgress = (video: any) => {
    const playedSeconds = video.playedSeconds || 0;

    const position = playedSeconds / duration;

    if (progressRef && progressRef.current && location.pathname.includes("music")) {
      progressRef.current.style.width = `${position * 100}%`;
    }
  };

  const controls = {
    isActive: rootControl === ROOT_CONTROL.MUSIC_TRACK_FILL,
    id: "track-fill-control",
    down: () => {
      dispatch(setRootControl(ROOT_CONTROL.MUSIC_PLAYER_CONTROLS));
    },
    up: () => {
      dispatch(setPrevRootControl(rootControl));
      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    },
    right: () => {},
    left: () => {},
  };

  useKeydown(controls);

  useEffect(() => {
    window.addEventListener("onPlay", onPlay);
    window.addEventListener("onPause", onPause);
    window.addEventListener("playOrPause", onPlayOrPause);

    return () => {
      window.removeEventListener("onPlay", onPlay);
      window.removeEventListener("onPause", onPause);
      window.removeEventListener("playOrPause", onPlayOrPause);
    };
  }, [playing]);

  useEffect(() => {
    return () => {
      if((window as any).Android) {
        (window as any).Android.setPlayerPositions(0, 0, 0, 0, window.innerWidth, window.innerHeight)
      }
    }
  }, [])  

  return (
    <div className="music__player">
      <div className="music__player__content">
        <div
          className={`content__fill ${
            rootControl === ROOT_CONTROL.MUSIC_TRACK_FILL ? "active" : ""
          }`}
        >
          <div
            className="track-fill-progress"
            style={{
              height: "100%",
              width: location.pathname.includes("radio") ? "100%" : "0%",
              background:
                "var(--primary-button-bg-color, var(--initial-primary-button-bg-color))",
            }}
            ref={progressRef}
          ></div>
        </div>
        {location.pathname.includes("music") && (
          <div
            className="content__duration"
            style={{
              width: "8.3rem",
            }}
          ></div>
        )}
      </div>

      <div
        className="player"
        style={{
          display: "none",
        }}
      >
        <AppPlayer
          url={
            location.pathname.includes("music")
              ? getUrl(musics[musicIndex]?.file)
              : musics[musicIndex]?.url
          }
          playing={playing}
          ref={videoRef}
          onReady={onReady}
          onDuration={onDuration}
          onProgress={onProgress}
          onPlay={onPlay}
          onPause={onPause}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
