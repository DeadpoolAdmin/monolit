import React from "react";
import Loader from "../Loader/Loader";
import { useClickBack } from "@/layout/Header/hooks/useClickBack";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useLocation } from "react-router-dom";


export const Load = () => {


  const { clickBack } = useClickBack();

  const location = useLocation();

  const controls = {
    isActive: !location.pathname.includes('player') || !location.pathname.includes('menu'),
    id: 'loading-control',
    back: clickBack,
  }


  useKeydown(controls);

  return (
    <Loader
        style={{
          background: "transparent",
          height: "15rem",
          width: "15rem",
          position: "fixed",
          top: "42rem",
          left: "90rem",
          zIndex: 1000,
        }}
      />
  )
}

const Loading = () => {
  return (
    <div className="loading__container" style={{
      width: '192rem',
      height: 'var(--screen-height)',
      background: 'var(--app-background) no-repeat',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
    }}>
      <Load />
    </div>
  );
};

export default Loading;
