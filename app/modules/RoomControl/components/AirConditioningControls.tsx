import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

interface AirConditioningControlsProps {
  conditionerIndex: number;
  temperatureValue: number;
  speedValue: number;
  heatingEnabled: boolean;
  rootControl: string;
  onHeatingChange: (newState: boolean) => void;
}

export const AirConditioningControls: React.FC<AirConditioningControlsProps> = ({
  conditionerIndex,
  temperatureValue,
  speedValue,
  heatingEnabled,
  rootControl,
  onHeatingChange,
}) => {
  return (
    <>
      <div className="room_control__conditioner__content">
        <div className="content__conditioner__temperature">
          <span>Temperature</span> <br />
          <div className="conditioner__temperature__action">
            <div
              className={`temperature__minus ${
                rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
                conditionerIndex === 0
                  ? "active"
                  : ""
              }`}
            >
              <FaMinus />
            </div>
            <span>{temperatureValue}°C</span>
            <div
              className={`temperature__plus ${
                rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
                conditionerIndex === 1
                  ? "active"
                  : ""
              }`}
            >
              <FaPlus />
            </div>
          </div>
        </div>
        <div className="content__conditioner__temperature">
          <span>Speed</span> <br />
          <div className="conditioner__temperature__action">
            <div
              className={`temperature__minus ${
                rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
                conditionerIndex === 2
                  ? "active"
                  : ""
              }`}
            >
              <FaMinus />
            </div>
            <span>{speedValue}</span>
            <div
              className={`temperature__plus ${
                rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
                conditionerIndex === 3
                  ? "active"
                  : ""
              }`}
            >
              <FaPlus />
            </div>
          </div>
        </div>
      </div>

      <div className="room_control__conditioner__heating__container">
        <div className="room_control__conditioner__heating">
          <span>Heat</span>
          <label
            className={`heating__switch ${
              rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
              conditionerIndex === 4
                ? "active"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={heatingEnabled}
              onChange={(e) => onHeatingChange(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="room_control__conditioner__heating">
          <span>Cool</span>
          <label
            className={`heating__switch ${
              rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
              conditionerIndex === 5
                ? "active"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={!heatingEnabled}
              onChange={(e) => onHeatingChange(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </>
  );
};

