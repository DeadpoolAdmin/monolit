import { DeviceName } from "../types/data.enum";
import { SmartDeviceType } from "../types/room_control.enum";

/**
 * Returns the appropriate CSS class name for a device based on its name/type
 */
export const getDeviceClassName = (deviceName: string): string => {
  switch (deviceName) {
    case DeviceName.MAKE_UP_ROOM:
      return "makeup";
    case SmartDeviceType.bedLight:
      return "bed_light";
    case SmartDeviceType.corridorLight:
      return "corridor_light";
    case SmartDeviceType.masterLight:
      return "master_light";
    case SmartDeviceType.curtain:
      return "curtains";
    case SmartDeviceType.dnd:
      return "disturb";
    case SmartDeviceType.led:
      return "scenes";
    case SmartDeviceType.airConditioning:
      return "conditioner";
    default:
      return "";
  }
};

