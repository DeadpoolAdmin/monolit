import React, { useEffect, useState } from "react";
import {
  FaPause,
  FaForwardStep,
  FaBackwardStep,
  FaPlay,
} from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";

import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { PMusicItem } from "../types/music.types";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useGlobalMusicPlayer } from "@/shared/hooks/useGlobalMusicPlayer";
import { setCurrentTrack, setIsPlay } from "@/slices/Music/musicSlice";
import { useNavigate } from "react-router-dom";
import { useResolution } from "@hotel-smarters/resolution-hook";

type Props = {
  musics: PMusicItem[];
  musicIndex: number;
  setMusicIndex: (index: number) => void;
};

const MusicPlayerControls: React.FC<Props> = ({
  musics,
  musicIndex,
  setMusicIndex,
}) => {
  const dispatch = useDispatch();
  const { isPlaying } = useGlobalMusicPlayer();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const [index, setIndex] = useState<number>(1); // Start at play/pause button (index 3)

  const currentTrack = useSelector((state: any) => state.music.currentTrack);

  const navigate = useNavigate();

  const deviceType = useResolution().getDeviceType();

  useEffect(() => {
    return () => {
      if (!window.Android) return;
      window.Android.destroyPlayer();
      window.Android.setPlayerPositions(
        0,
        0,
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      setIndex(1); // Reset to play/pause button position
    };
  }, []);

  // Reset focus to play/pause button when player controls become active
  useEffect(() => {
    if (rootControl === ROOT_CONTROL.MUSIC_PLAYER_CONTROLS) {
      setIndex(1); // Focus on play/pause button
    }
  }, [rootControl]);

  useEffect(() => {
    dispatch(setCurrentTrack(musics[musicIndex]));
  }, [musicIndex]);

  useEffect(() => {
    console.log("currentTrack", currentTrack);
  }, [currentTrack]);

  const onPrevMusic = () => {
    if (musicIndex === 0) {
      return;
    }
    setMusicIndex(musicIndex - 1);
  };

  const onNextMusic = () => {
    if (musicIndex !== musics.length - 1) {
      setMusicIndex(musicIndex + 1);
    }
  };

  const onPlayPauseMusic = () => {
    dispatch(setIsPlay(!isPlaying));
    if (!isPlaying) {
      window.dispatchEvent(new CustomEvent("globalMusicPlay"));
    } else {
      window.dispatchEvent(new CustomEvent("globalMusicPause"));
    }
  };

  const controls = {
    isActive: rootControl === ROOT_CONTROL.MUSIC_PLAYER_CONTROLS,
    id: "player-controls",
    ok: () => {
      switch (index) {
        case 0:
          onPrevMusic();
          break;
        case 1:
          onPlayPauseMusic();
          break;
        case 2:
          onNextMusic();
          break;
      }
    },
    up: () => {
      dispatch(setPrevRootControl(rootControl));
      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    },
    right: () => setIndex((prev) => Math.min(prev + 1, 2)),
    left: () => setIndex((prev) => Math.max(prev - 1, 0)),
    back: () => {
      navigate(-1);
    },
  };

  useKeydown(controls);

  const isActive = (i: number) =>
    deviceType === 'TV' && index === i && rootControl === ROOT_CONTROL.MUSIC_PLAYER_CONTROLS
      ? "active"
      : "";

  return (
    <div className="music__player_controls">
      <div className="player__content">
        <div className={`forward__step ${isActive(0)}`} onClick={onPrevMusic}>
          <FaBackwardStep />
        </div>
        <div className={`pause ${isActive(1)}`} onClick={onPlayPauseMusic}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
        <div className={`forward__step ${isActive(2)}`} onClick={onNextMusic}>
          <FaForwardStep />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerControls;
