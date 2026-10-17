import React, { useCallback, useMemo, memo } from "react";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { SmartDeviceType } from "../types/room_control.enum";
import { useWindowControls } from "../hooks/useWindowControls";
import { useTemperatureControls } from "../hooks/useTemperatureControls";
import { useAirConditionerControls } from "../hooks/useAirConditionerControls";
import { RoomControlItemHeader } from "./RoomControlItemHeader";
import { RoomControlItemImages } from "./RoomControlItemImages";
import { WindowControls } from "./WindowControls";
import { TemperatureControls } from "./TemperatureControls";
import { AirConditioningControls } from "./AirConditioningControls";
import { useResolution } from "@hotel-smarters/resolution-hook";

interface RoomControlListItemProps {
  style: React.CSSProperties;
  item: any;
  isActive: boolean;
  isToggled: boolean;
  onToggle: () => void;
}

const RoomControlListItem: React.FC<RoomControlListItemProps> = ({
  style,
  item,
  isActive,
  isToggled,
  onToggle,
}) => {
  // Custom hooks for different device types
  const windowType = item.name === SmartDeviceType.curtain ? 'curtain' : 
                     item.name === SmartDeviceType.blind ? 'blind' : null;
  const windowControls = windowType ? useWindowControls(windowType) : null;
  const temperatureControls = useTemperatureControls({ item });
  const airConditionerControls = useAirConditionerControls({ item });

  const deviceType = useResolution().getDeviceType();

  // Main item controls for regular items (lights, DND, etc.)
  const handleMainItemOk = useCallback(() => {
    onToggle();

    // Dispatch custom event for hardware/backend integration
    window.dispatchEvent(
      new CustomEvent("onroomcontrol", {
        detail: {
          itemId: item.id,
          type: item.type || item.name,
          action: isToggled ? "deactivate" : "activate",
        },
      })
    );
  }, [onToggle, item.id, item.type, item.name, isToggled]);

  const mainItemControls = useMemo(
    () => ({
      isActive: isActive,
      id: `room-control-item-${item.id}`,
      ok: handleMainItemOk,
    }),
    [isActive, item.id, handleMainItemOk]
  );

  useKeydown(mainItemControls);

  return (
    <div
      className={`list__item ${isActive && deviceType === 'TV' ? "active" : ""} ${
        isToggled ? "toggled" : ""
      }`}
      style={style}
      onClick={onToggle}
    >
      <RoomControlItemHeader
        displayName={item.displayName}
        deviceName={item.name}
      />

      <div className="item__content">
        <RoomControlItemImages
          item={item}
          isToggled={isToggled}
          curtainImageRef={item.name === SmartDeviceType.curtain ? windowControls?.imageRef : undefined}
          blindImageRef={item.name === SmartDeviceType.blind ? windowControls?.imageRef : undefined}
        />

        {windowType && windowControls && (
          <WindowControls
            type={windowType}
            rootControl={windowControls.rootControl}
            onUp={windowControls.onUp}
            onBack={windowControls.onBack}
            onRightFromClose={windowControls.onRightFromClose}
            onLeftFromOpen={windowControls.onLeftFromOpen}
            onClose={windowControls.onClose}
            onOpen={windowControls.onOpen}
            onRightFromOpen={windowControls.onRightFromOpen}
            stop={windowControls.stop}
            stopClose={windowControls.stopClose}
          />
        )}

        {item.name === SmartDeviceType.temperature && (
          <TemperatureControls
            temperatureIndex={temperatureControls.temperatureIndex}
            counterValue={temperatureControls.counterValue}
            rootControl={temperatureControls.rootControl}
            onTemperatureLeft={temperatureControls.onTemperatureClickDecrease}
            onTemperatureRight={temperatureControls.onTemperatureClickIncrease}
          />
        )}

        {item.name === SmartDeviceType.airConditioning && (
          <AirConditioningControls
            conditionerIndex={airConditionerControls.conditionerIndex}
            temperatureValue={airConditionerControls.temperatureValue}
            speedValue={airConditionerControls.speedValue}
            heatingEnabled={airConditionerControls.heatingEnabled}
            rootControl={airConditionerControls.rootControl}
            onHeatingChange={airConditionerControls.handleHeatingChange}
          />
        )}
      </div>
    </div>
  );
};

export default memo(RoomControlListItem);
