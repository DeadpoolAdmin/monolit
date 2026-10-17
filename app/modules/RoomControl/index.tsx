import React, { useEffect, useMemo, useRef } from "react";
import RoomControlList from "./components/RoomControlList";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import {
  useGetAllStatusesQuery,
  useGetRoomControlSettingsQuery,
} from "@/services/RoomControl/RoomControlApi";
import QueryWrapper from "@/shared/components/QueryWrapper";
import {
  AddressValueType,
  DeviceName,
  IBackendDevice,
  Register,
  RegisterType,
  StatusRegister,
} from "./types/data.enum";


import masterLight from '@/assets/room_control/svgs/master_light.svg'
import bedLight from '@/assets/room_control/svgs/bed_light.svg'
import led from '@/assets/room_control/svgs/led.svg'
import curtain from '@/assets/room_control/svgs/curtains_closed.svg'
import disturb from '@/assets/room_control/disturb.png'
import makeUpRoom from '@/assets/room_control/svgs/makeup.svg'
import corridorLight from '@/assets/room_control/svgs/corrdior.svg'
import blind from '@/assets/room_control/svgs/blinds.svg'

import masterLightActive from '@/assets/room_control/svgs/active/master_light_active.svg'
import bedLightActive from '@/assets/room_control/svgs/active/bed_light_active.svg'
import ledActive from '@/assets/room_control/svgs/active/led_active.svg'
import curtainActive from '@/assets/room_control/svgs/active/curtains_open_active.svg'
import temperatureActive from '@/assets/room_control/svgs/active/temperature_active.svg'
import disturbActive from '@/assets/room_control/svgs/active/dnd_active.svg'
import makeUpRoomActive from '@/assets/room_control/svgs/active/makeup_active.svg'
import blindActive from '@/assets/room_control/svgs/active/blinds_active.svg'
import corridorLightActive from '@/assets/room_control/svgs/active/corridor_active.svg'

import masterLightShow from '@/assets/room_control/svgs/show/master_light_show.svg'
import bedLightShow from '@/assets/room_control/svgs/show/bed_light_show.svg'


import RoomControlServerIssue from "./components/RoomControlError";
import { useResolution } from "@hotel-smarters/resolution-hook";

const RoomControl = () => {
  const dispatch = useDispatch();

  const {
    data: roomControlSettings,
    isLoading: roomControlSettingsLoading,
    error: roomControlSettingsError,
  } = useGetRoomControlSettingsQuery(undefined);

  const {
    data: roomControlStatus,
    isLoading: roomControlStatusLoading,
    refetch: roomControlStatusRefetch
  } = useGetAllStatusesQuery(undefined);

  
  const roomControlUrl = useMemo(() => localStorage.getItem('roomControlUrl'), []);

  const deviceType = useResolution().getDeviceType();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      roomControlStatusRefetch();
    }, 3000);

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [roomControlStatusRefetch]);


  // Memoize dataExample object to prevent recreation on every render
  const dataExample = useMemo(() => ({
    [DeviceName.MASTER_LIGHT]: {
      id: 1,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.MASTER_LIGHT,
      displayName: "Master Light",
      icon: masterLight,
      iconActive: masterLightActive,
      iconShow: masterLightShow,
      visible: true,
      status: roomControlStatus?.[StatusRegister.MASTER_LIGHT],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.MASTER_LIGHT,
        registerToAction: Register.MASTER_LIGHT,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
    },
    [DeviceName.MAKE_UP_ROOM]: {
      id: 2,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.MAKE_UP_ROOM,
      displayName: "Make Up Room",
      icon: makeUpRoom,
      iconActive: makeUpRoomActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.MAKE_UP_ROOM],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.MAKE_UP_ROOM,
        registerToAction: Register.MAKE_UP_ROOM,
        valueType: AddressValueType.BOOLEAN,  
        min: 0,
        max: 1,
      },
    },
    [DeviceName.BED_LIGHT]: {
      id: 3,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.BED_LIGHT,
      displayName: "Bed Light",
      icon: bedLight,
      iconActive: bedLightActive,
      iconShow: bedLightShow,
      visible: true,
      status: roomControlStatus?.[StatusRegister.BED_LIGHT],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.BED_LIGHT,
        registerToAction: Register.BED_LIGHT,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
    },
    [DeviceName.CORRIDOR_LIGHT]: {
      id: 4,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.CORRIDOR_LIGHT,
      displayName: "Corridor Light",
      icon: corridorLight,
      iconActive: corridorLightActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.CORRIDOR_LIGHT],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.CORRIDOR_LIGHT,
        registerToAction: Register.CORRIDOR_LIGHT,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
    },
    [DeviceName.LED]: {
      id: 5,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.LED,
      displayName: "LED",
      icon: led,
      iconActive: ledActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.LED],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.LED,
        registerToAction: Register.LED,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
    },
    [DeviceName.CURTAIN]: {
      id: 6,
      includes: [RegisterType.OPEN, RegisterType.CLOSE],
      name: DeviceName.CURTAIN,
      displayName: "Curtains",
      icon: curtain,
      iconActive: curtainActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.CURTAIN],
      [RegisterType.OPEN]: {
        statusRegisterKey: null,
        registerToAction: Register.OPEN_CURTAIN,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
      [RegisterType.CLOSE]: {
        statusRegisterKey: null,
        registerToAction: Register.CLOSE_CURTAIN,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
      [RegisterType.OPEN_CLOSE_STATUS]: {
        statusRegisterKey: StatusRegister.CURTAIN,
        registerToAction: null,
        min: 0,
        max: 1,
      },
    },
    [DeviceName.BLIND]: {
      id: 7,
      includes: [
        RegisterType.OPEN,
        RegisterType.CLOSE,
        RegisterType.OPEN_CLOSE_STATUS,
      ],
      name: DeviceName.BLIND,
      displayName: "Blind",
      visible: true,
      icon: blind,
      iconActive: blindActive,
      status: roomControlStatus?.[StatusRegister.BLIND],
      [RegisterType.OPEN]: {
        statusRegisterKey: null,
        registerToAction: Register.BLIND,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
      [RegisterType.CLOSE]: {
        statusRegisterKey: null,
        registerToAction: Register.BLIND,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
      [RegisterType.OPEN_CLOSE_STATUS]: {
        statusRegisterKey: StatusRegister.BLIND,
        registerToAction: null,
        min: 0,
        max: 1,
      },
    },
    // [DeviceName.AIR_CONDITIONING]: {
    //   id: 8,
    //   includes: [
    //     RegisterType.ON_OFF,
    //     RegisterType.SPEED,
    //     RegisterType.TEMPERATURE,
    //     RegisterType.HEATING,
    //   ],
    //   name: DeviceName.AIR_CONDITIONING,
    //   displayName: "Air Conditioning",
    //   icon: airConditioning,
    //   iconActive: conditionerOn,
    //   visible: true,
    //   status: roomControlStatus?.[StatusRegister.AIR_CONDITIONING_ON_OFF],
    //   [RegisterType.ON_OFF]: {
    //     statusRegisterKey: StatusRegister.AIR_CONDITIONING_ON_OFF,
    //     registerToAction: Register.AIR_CONDITIONING_ON_OFF,
    //     valueType: AddressValueType.BOOLEAN,
    //     min: 0,
    //     max: 1,
    //     value: roomControlStatus?.[StatusRegister.AIR_CONDITIONING_ON_OFF],
    //   },
    //   [RegisterType.SPEED]: {
    //     statusRegisterKey: StatusRegister.AIR_CONDITIONING_SPEED,
    //     registerToAction: Register.AIR_CONDITIONING_SPEED,
    //     valueType: AddressValueType.INTEGER,
    //     min: 0,
    //     max: 10,
    //     value: roomControlStatus?.[StatusRegister.AIR_CONDITIONING_SPEED],
    //   },
    //   [RegisterType.TEMPERATURE]: {
    //     statusRegisterKey: StatusRegister.AIR_CONDITIONING_TEMPERATURE,
    //     registerToAction: Register.AIR_CONDITIONING_TEMPERATURE,
    //     valueType: AddressValueType.INTEGER,
    //     min: 16,
    //     max: 30,
    //     value: roomControlStatus?.[StatusRegister.AIR_CONDITIONING_TEMPERATURE],
    //   },
    //   [RegisterType.HEATING]: {
    //     statusRegisterKey: StatusRegister.AIR_CONDITIONING_HEATING,
    //     registerToAction: Register.AIR_CONDITIONING_HEATING,
    //     valueType: AddressValueType.BOOLEAN,
    //     min: 0,
    //     max: 1,
    //     value: roomControlStatus?.[StatusRegister.AIR_CONDITIONING_HEATING],
    //   },
    // },
    [DeviceName.TEMPERATURE]: {
      id: 9,
      includes: [RegisterType.COUNTER],
      name: DeviceName.TEMPERATURE,
      displayName: "Temperature",
      icon: temperatureActive,
      iconActive: temperatureActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.TEMPERATURE],
      [RegisterType.COUNTER]: {
        statusRegisterKey: StatusRegister.TEMPERATURE,
        registerToAction: Register.TEMPERATURE,
        valueType: AddressValueType.INTEGER,
        min: 16,
        max: 30,
      },
    },
    [DeviceName.DO_NOT_DISTURB]: {
      id: 10,
      includes: [RegisterType.ON_OFF],
      name: DeviceName.DO_NOT_DISTURB,
      displayName: "Do Not Disturb",
      icon: disturb,
      iconActive: disturbActive,
      visible: true,
      status: roomControlStatus?.[StatusRegister.DND],
      [RegisterType.ON_OFF]: {
        statusRegisterKey: StatusRegister.DND,
        registerToAction: Register.DND,
        valueType: AddressValueType.BOOLEAN,
        min: 0,
        max: 1,
      },
    },
  }), [roomControlStatus]);

  // Memoize roomControlList calculation to prevent unnecessary recalculations
  const roomControlList = useMemo(() => {
    if (!roomControlSettings) {
      return [];
    }

    return Object.values(dataExample).map((item: any) => {
      const deviceSetting = roomControlSettings.devices.find((device: IBackendDevice) => device.name === item.name);
      return {
        ...item,
        visible: deviceSetting?.visible ?? item.visible,
      };
    });
  }, [roomControlSettings, dataExample]);

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch]);

  if (roomControlSettingsError) {
    if ('data' in roomControlSettingsError && roomControlSettingsError.data) {
      const data = roomControlSettingsError.data as any;
      if (data && typeof data === 'object' && 'error' in data && data.error === 'Not Found') {
        return <RoomControlServerIssue errorType="not_found" />;
      }
    }

    if ('status' in roomControlSettingsError && roomControlSettingsError.status === 'FETCH_ERROR') {
      return <RoomControlServerIssue errorType="fetch_error" />;
    }

    if(!roomControlUrl) {
      return <RoomControlServerIssue errorType="not_found" />;
    }
  }

  return (
    <QueryWrapper
      isLoading={roomControlSettingsLoading || roomControlStatusLoading}
    >
      <div className={`room_control ${deviceType === 'TABLET' ? 'tablet' : ''}`}>
        <RoomControlList list={roomControlList} />
      </div>
    </QueryWrapper>
  );
};

export default RoomControl;
