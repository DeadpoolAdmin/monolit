import React, { useEffect } from "react";

import { AppPlayer } from "@hotel-smarters/player";
import { useLocation } from "react-router-dom";
import { useResolution } from "@hotel-smarters/resolution-hook";

const SignageVideo = () => {
  const location = useLocation();
  const src = location.state?.src;

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  useEffect(() => {
    if(window.Android) {
      window.Android.setPlayerFullScreen();
    }
  }, [])

  useEffect(() => {

    document.body.style.background = 'transparent'

    return () => {
      document.body.style.background = 'black'
      if (window.Android) {
        window.Android.destroyPlayer();
        window.Android.setPlayerPositions(0, 0, 0, 0, 0, 0);
      }
    };
  }, []);

  return (
    <div
      className="signage-player"
      style={{
        width: "100%",
        height:  'var(--screen-height)',
      }}
    >
      <AppPlayer
        loop={true}
        muted={false}
        playing
        url={src as string}
      />
    </div>
  );
};

export default SignageVideo;
