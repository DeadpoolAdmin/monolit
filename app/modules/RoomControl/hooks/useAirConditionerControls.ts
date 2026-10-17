import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { SmartDeviceType } from "../types/room_control.enum";
import { Register } from "../types/data.enum";
import { useOnSetActionStatus } from "./useOnSetActionStatus";

interface UseAirConditionerControlsProps {
  item: any;
}

export const useAirConditionerControls = ({ item }: UseAirConditionerControlsProps) => {
  const dispatch = useDispatch();
  const rootControl = useSelector((state: any) => state.rootControl.rootControl);
  const { onSetActionStatus } = useOnSetActionStatus();

  const [conditionerIndex, setConditionerIndex] = useState<number>(0);
  const [temperatureValue, setTemperatureValue] = useState<number>(0);
  const [speedValue, setSpeedValue] = useState<number>(0);
  const [heatingEnabled, setHeatingEnabled] = useState<boolean>(false);

  useEffect(() => {
    setTemperatureValue(item.temperature?.value || 0);
  }, [item.temperature?.value]);

  useEffect(() => {
    setSpeedValue(item.speed?.value || 0);
  }, [item.speed?.value]);

  useEffect(() => {
    setHeatingEnabled(item.heating?.value || false);
  }, [item.heating?.value]);

  const onConditionerTemperatureUp = useCallback(() => {
    if (conditionerIndex === 4 || conditionerIndex === 5) {
      setConditionerIndex(0);
    } else {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
    }
  }, [dispatch, conditionerIndex]);

  const onConditionerTemperatureDown = useCallback(() => {
    if (conditionerIndex === 4) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
    } else {
      setConditionerIndex(4);
    }
  }, [conditionerIndex, dispatch]);

  const handleConditionerOk = useCallback(() => {
    if (conditionerIndex === 0) {
      // conditioner temperature down
      if (temperatureValue <= 16) return;
      setTemperatureValue(temperatureValue - 1);
      onSetActionStatus(Register.AIR_CONDITIONING_TEMPERATURE, temperatureValue - 1);
    } else if (conditionerIndex === 1) {
      // conditioner temperature up
      if (temperatureValue >= 30) return;
      setTemperatureValue(temperatureValue + 1);
      onSetActionStatus(Register.AIR_CONDITIONING_TEMPERATURE, temperatureValue + 1);
    } else if (conditionerIndex === 2) {
      // conditioner speed down
      if (speedValue <= 0) return;
      setSpeedValue(speedValue - 1);
      onSetActionStatus(Register.AIR_CONDITIONING_SPEED, speedValue - 1);
    } else if (conditionerIndex === 3) {
      // conditioner speed up
      if (speedValue >= 10) return;
      setSpeedValue(speedValue + 1);
      onSetActionStatus(Register.AIR_CONDITIONING_SPEED, speedValue + 1);
    } else if (conditionerIndex === 4) {
      // heating toggle
      const newHeatingState = !heatingEnabled;
      setHeatingEnabled(newHeatingState);
      onSetActionStatus(Register.AIR_CONDITIONING_HEATING, newHeatingState);
    } else if (conditionerIndex === 5) {
      // cooling toggle
      const newHeatingState = !heatingEnabled;
      setHeatingEnabled(newHeatingState);
      onSetActionStatus(Register.AIR_CONDITIONING_HEATING, newHeatingState);
    }
  }, [conditionerIndex, temperatureValue, speedValue, heatingEnabled, onSetActionStatus]);

  const handleConditionerRight = useCallback(() => {
    if (conditionerIndex === 5) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
      setConditionerIndex(0);
    } else {
      setConditionerIndex(conditionerIndex + 1);
    }
  }, [conditionerIndex, dispatch]);

  const handleConditionerLeft = useCallback(() => {
    if (conditionerIndex === 0) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
      setConditionerIndex(0);
    } else {
      setConditionerIndex(conditionerIndex - 1);
    }
  }, [conditionerIndex, dispatch]);

  const handleConditionerBack = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
    setConditionerIndex(0);
  }, [dispatch]);

  const onConditionerControls = useMemo(
    () => ({
      isActive:
        rootControl === ROOT_CONTROL.ROOM_CONTROL_CONDITIONER &&
        item.name === SmartDeviceType.airConditioning,
      id: `room-control-item-${item.id}`,
      up: onConditionerTemperatureUp,
      down: onConditionerTemperatureDown,
      back: handleConditionerBack,
      ok: handleConditionerOk,
      right: handleConditionerRight,
      left: handleConditionerLeft,
    }),
    [
      rootControl,
      item.name,
      item.id,
      onConditionerTemperatureUp,
      onConditionerTemperatureDown,
      handleConditionerBack,
      handleConditionerOk,
      handleConditionerRight,
      handleConditionerLeft,
    ]
  );

  useKeydown(onConditionerControls);

  const handleHeatingChange = useCallback(
    (newHeatingState: boolean) => {
      setHeatingEnabled(newHeatingState);
      onSetActionStatus(Register.AIR_CONDITIONING_HEATING, newHeatingState);
    },
    [onSetActionStatus]
  );

  return {
    conditionerIndex,
    temperatureValue,
    speedValue,
    heatingEnabled,
    rootControl,
    handleHeatingChange,
  };
};

