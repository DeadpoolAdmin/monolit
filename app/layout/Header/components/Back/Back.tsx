import { ROUTE_PATHS } from "@/shared/types/date/date";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import React, { useRef } from "react";

import { BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const Back = ({
  isActive,
  onClick,
  style,
}: {
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}) => {
  const goBackRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const prevRootControl = useSelector(
    (state: any) => state.rootControl.prevRootControl
  );

  const location = useLocation();

  const controls = {
    id: "back-control",
    isActive: isActive,
    ok: () => onClick({} as React.MouseEvent<HTMLDivElement>),
    down: () => {
      dispatch(setRootControl(prevRootControl!));
    },
    right: () => {
      if (location.pathname === ROUTE_PATHS.VOD) {
        dispatch(setRootControl(ROOT_CONTROL.HEADER_SEARCH));
      }
    },
    back: () => onClick({} as React.MouseEvent<HTMLDivElement>),
  };

  useKeydown(controls);

  return (
    <div onClick={onClick} className={`go__back`} ref={goBackRef} style={style}>
      <div className={`back__icon ${isActive ? "active" : ""}`}>
        <BsArrowLeft />
      </div>
    </div>
  );
};

export default Back;
