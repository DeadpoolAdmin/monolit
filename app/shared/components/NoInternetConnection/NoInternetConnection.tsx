import React, { useEffect, useState } from "react";

import "@/shared/styles/NoInternetConnection/noInternetConnection.scss";

import { Button } from "@shared/components/Button/Button";
import { reloadApp } from "@/shared/hooks/useReload";

const NoWifiSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 207 207"
    fill="none"
    className="no_wifi_svg"
  >
    <path
      d="M103.5 168.274L103.586 168.179M25.875 25.875L181.125 181.125M17.25 69C27.2218 61.4934 38.1112 55.2907 49.6541 50.5425M189.75 69C158.941 45.885 122.009 36.5441 86.25 40.9515M43.125 103.5C54.6221 94.875 68.0426 89.1221 82.0927 86.25M163.875 103.5C152.881 95.3645 140.297 89.634 126.943 86.6813M73.3125 133.688C92.7188 121.613 114.281 121.613 133.688 133.688"
      stroke="white"
      stroke-opacity="0.6"
      stroke-width="4.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const NoInternetConnection = () => {
  return (
    <div className="no_internet_connection">
      <div className="no_internet_connection__title">
        <span>Temporarily lost connection </span>
      </div>
      <div className="no_internet_connection__description">
        <span>
          You’re currently offline. Please check your internet connection while
          we attempt to reconnect you
        </span>
      </div>
      <div className="no_internet_connection__image">
        <NoWifiSvg />
      </div>

      <div className="no_internet_connection__button">
        <Button
          minWidth="33"
          maxWidth="33"
          className="active"
          isActive={true}
          ok={() => {
            reloadApp();
          }}
        >
          <span className="button-text">Retry</span>
        </Button>
      </div>
    </div>
  );
};

export default NoInternetConnection;
