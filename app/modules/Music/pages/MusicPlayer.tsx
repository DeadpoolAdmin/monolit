import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { convertTime } from "@/shared/functions/convertTime";

const MusicPlayer = React.memo(() => {
  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const musicState = useSelector((state: any) => state.music);
  const { currentTime, duration } = musicState;

  const progressRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const location = useLocation();

  const navigate = useNavigate();

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const controls = {
    isActive: rootControl === ROOT_CONTROL.MUSIC_TRACK_FILL,
    id: "track-fill-control",
    down: () => {
      dispatch(setRootControl(ROOT_CONTROL.MUSIC_TRACK_FILL));
    },
    up: () => {
      dispatch(setPrevRootControl(rootControl))
      dispatch(setRootControl(ROOT_CONTROL.MUSIC_CATEGORIES));
    },
    back: () => {
      navigate(-1);
    },
  };

  useKeydown(controls);

  return (
    <div className="music__player">
      <div className="music__player__content">
        <div
          className={`content__fill ${
            controls.isActive ? "active" : ""
          }`}
        >
          <div
            className="track-fill-progress"
            style={{
              height: "100%",
              width: location.pathname.includes("radio") ? "100%" : `${progressPercentage}%`,
              background:
                "var(--primary-button-bg-color, var(--initial-primary-button-bg-color))",
              transition: "width 0.1s ease",
            }}
            ref={progressRef}
          ></div>
        </div>
        {location.pathname.includes("music") && (
          <div
            className="content__duration"
            style={{
              width: "8.3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.9rem",
              color: "var(--text-color, #fff)",
            }}
          >
            {duration > 0 ? `${convertTime(currentTime)} / ${convertTime(duration)}` : "--:-- / --:--"}
          </div>
        )}
      </div>
    </div>
  );
});

export default MusicPlayer;
