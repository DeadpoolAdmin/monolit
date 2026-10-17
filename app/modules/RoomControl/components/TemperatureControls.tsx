import React from "react";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { Button } from "@/shared/components/Button/Button";
import { useResolution } from "@hotel-smarters/resolution-hook";

interface TemperatureControlsProps {
  temperatureIndex: number;
  counterValue: number;
  rootControl: string;
  onTemperatureLeft: () => void;
  onTemperatureRight: () => void;
}

export const TemperatureControls: React.FC<TemperatureControlsProps> = ({
  temperatureIndex,
  counterValue,
  rootControl,
  onTemperatureLeft,
  onTemperatureRight,
}) => {

  const deviceType = useResolution().getDeviceType();

  return (
    <div className="room_control__content__temperature">
      <Button
        className={`temperature__minus ${
          temperatureIndex === 0 &&
          rootControl === ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS &&
          deviceType === 'TV'
            ? "active"
            : ""
        }`}
        onClick={onTemperatureLeft}
        isActive={temperatureIndex === 0 && rootControl === ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS && deviceType === 'TV'}
      >
        <span>-</span>
      </Button>
      <span>{counterValue}°C</span>
      <Button
        isActive={temperatureIndex === 1 && rootControl === ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS && deviceType === 'TV'}
        className={`temperature__plus ${
          temperatureIndex === 1 &&
          deviceType === 'TV' &&
          rootControl === ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS
            ? "active"
            : ""
        }`}
        onClick={onTemperatureRight}
      >
        <span>+</span>
      </Button>
    </div>
  );
};

