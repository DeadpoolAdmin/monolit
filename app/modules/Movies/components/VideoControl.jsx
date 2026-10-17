import React, { forwardRef, useEffect, useRef } from "react";
import DurationTime from "./DurationTime";

import "../styles/control.scss";

import Controls from "./Controls";
import { useResolution } from "@hotel-smarters/resolution-hook";
import Back from "@/layout/Header/components/Back/Back";
import { useNavigate } from "react-router";
const VideoControl = ({
  progressRef,
  currentTimeRef,
  durationRef,
  controlRef,
  playing,
  progressInnerRef,
  onPlay,
  onPause,
}) => {
  const deviceType = useResolution().getDeviceType();

  const navigate = useNavigate();

  const onClickBack = () => {
    navigate(-1);
  };

  return (
    <div className="videoPlayer__control" ref={controlRef}>
      {deviceType !== "TV" && (
        <Back isActive={false} onClick={onClickBack} style={{
          position: 'absolute',
          top: '-91.3rem',
          left: '8.4rem'
        }} />
      )}

      <DurationTime
        progressInnerRef={progressInnerRef}
        durationRef={durationRef}
        currentTimeRef={currentTimeRef}
        progressRef={progressRef}
      />
      <Controls onPlay={onPlay} onPause={onPause} playing={playing} />
    </div>
  );
};

export default VideoControl;
