import React from "react";
import switchIcon from "@/assets/room_control/switch.png";
import { SmartDeviceType } from "../types/room_control.enum";

interface RoomControlItemHeaderProps {
  displayName: string;
  deviceName: string;
}

export const RoomControlItemHeader: React.FC<RoomControlItemHeaderProps> = ({
  displayName,
  deviceName,
}) => {
  const showSwitch =
    deviceName !== SmartDeviceType.temperature &&
    deviceName !== SmartDeviceType.curtain &&
    deviceName !== SmartDeviceType.blind;

  return (
    <div className="item__top">
      <div className="top__title">
        <span>{displayName}</span>
      </div>
      {showSwitch && (
        <div className="top__right">
          <img src={switchIcon} alt="switch" />
        </div>
      )}
    </div>
  );
};

