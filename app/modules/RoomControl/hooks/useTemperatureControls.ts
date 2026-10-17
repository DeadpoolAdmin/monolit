import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { SmartDeviceType } from "../types/room_control.enum";
import { useOnSetActionStatus } from "./useOnSetActionStatus";

interface UseTemperatureControlsProps {
  item: any;
}

export const useTemperatureControls = ({ item }: UseTemperatureControlsProps) => {
  const dispatch = useDispatch();
  const rootControl = useSelector((state: any) => state.rootControl.rootControl);
  const { onSetActionStatus } = useOnSetActionStatus();
  
  const [temperatureIndex, setTemperatureIndex] = useState<number>(0);
  const [counterValue, setCounterValue] = useState<number>(0);

  useEffect(() => {
    if (typeof item.status === "number") {
      setCounterValue(item.status);
    }
  }, [item.status]);

  const onTemperatureUp = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch]);

  const onTemperatureBack = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch]);

  const onTemperatureLeft = useCallback(() => {
    if (temperatureIndex === 0) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
    } else {
      setTemperatureIndex(temperatureIndex - 1);
    }
  }, [dispatch, temperatureIndex]);

  const onTemperatureRight = useCallback(() => {
    if (temperatureIndex === 1) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
    } else {
      setTemperatureIndex(temperatureIndex + 1);
    }
  }, [dispatch, temperatureIndex]);

  const onTemperatureOk = useCallback(() => {
    if (temperatureIndex === 0) {
      // Don't decrease if already at minimum (16)
      if (counterValue > 16) {
        const newValue = counterValue - 1;
        setCounterValue(newValue);
        if (item.counter?.registerToAction) {
          onSetActionStatus(item.counter.registerToAction, newValue);
        }
      }
    } else {
      // Don't increase if already at maximum (30)
      if (counterValue < 30) {
        const newValue = counterValue + 1;
        setCounterValue(newValue);
        if (item.counter?.registerToAction) {
          onSetActionStatus(item.counter.registerToAction, newValue);
        }
      }
    }
  }, [temperatureIndex, counterValue, item.counter?.registerToAction, onSetActionStatus]);

  // Handlers for direct mouse clicks (bypass navigation)
  const onTemperatureClickDecrease = useCallback(() => {
    // Don't decrease if already at minimum (16)
    if (counterValue > 16) {
      const newValue = counterValue - 1;
      setCounterValue(newValue);
      if (item.counter?.registerToAction) {
        onSetActionStatus(item.counter.registerToAction, newValue);
      }
    }
  }, [counterValue, item.counter?.registerToAction, onSetActionStatus]);

  const onTemperatureClickIncrease = useCallback(() => {
    // Don't increase if already at maximum (30)
    if (counterValue < 30) {
      const newValue = counterValue + 1;
      setCounterValue(newValue);
      if (item.counter?.registerToAction) {
        onSetActionStatus(item.counter.registerToAction, newValue);
      }
    }
  }, [counterValue, item.counter?.registerToAction, onSetActionStatus]);

  const onTemperatureControls = useMemo(
    () => ({
      isActive:
        rootControl === ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS &&
        item.name === SmartDeviceType.temperature,
      id: `room-control-item-${item.id}`,
      up: onTemperatureUp,
      back: onTemperatureBack,
      left: onTemperatureLeft,
      right: onTemperatureRight,
      ok: onTemperatureOk,
    }),
    [
      rootControl,
      item.name,
      item.id,
      onTemperatureUp,
      onTemperatureBack,
      onTemperatureLeft,
      onTemperatureRight,
      onTemperatureOk,
    ]
  );

  useKeydown(onTemperatureControls);

  return {
    temperatureIndex,
    counterValue,
    rootControl,
    onTemperatureControls,
    onTemperatureClickDecrease,
    onTemperatureClickIncrease,
  };
};

