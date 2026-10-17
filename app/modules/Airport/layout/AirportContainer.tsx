import React from "react";
import { Outlet } from "react-router-dom";

import "../styles/index.scss";

const AirportContainer = () => {
  return (
    <div className="airport">
      <Outlet />
    </div>
  );
};

export default AirportContainer;
