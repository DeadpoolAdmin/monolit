import { useResolution } from "@hotel-smarters/resolution-hook";
import React from "react";
import { useLocation } from "react-router-dom";

const SignageImage = () => {
  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const location = useLocation();

  const src = location.state?.src;

  return (
    <div
      className="signage-image"
      style={{
        width: "192rem",
        height:  'var(--screen-height)',
      }}
    >
      <img src={src as string} alt="Signage Image" style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }} />
    </div>
  );
};

export default SignageImage;
