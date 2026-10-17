import React from "react";
import { useLocation } from "react-router-dom";

const SignageUrl = () => {
  const location = useLocation();
  const src = location.state?.src;

  return (
    <div
      className="signage-url"
      style={{
        width: "192rem",
        height:  'var(--screen-height)',
        background: 'black'
      }}
    >
      <iframe style={{
        border: '0'
      }} src={src} width="100%" height="100%" />
    </div>
  );
};

export default SignageUrl;
