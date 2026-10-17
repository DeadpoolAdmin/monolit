import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { Register } from "../types/data.enum";
import { useOnSetActionStatus } from "./useOnSetActionStatus";

type WindowControlType = 'curtain' | 'blind';

interface WindowControlConfig {
  openControl: typeof ROOT_CONTROL[keyof typeof ROOT_CONTROL];
  closeControl: typeof ROOT_CONTROL[keyof typeof ROOT_CONTROL];
  openRegister: Register;
  closeRegister: Register;
  openEventName: string;
  closeEventName: string;
}

const CONTROL_CONFIGS: Record<WindowControlType, WindowControlConfig> = {
  curtain: {
    openControl: ROOT_CONTROL.ROOM_CONTROL_CURTAIN_OPEN,
    closeControl: ROOT_CONTROL.ROOM_CONTROL_CURTAIN_CLOSE,
    openRegister: Register.OPEN_CURTAIN,
    closeRegister: Register.CLOSE_CURTAIN,
    openEventName: 'curtainOpen',
    closeEventName: 'curtainClose',
  },
  blind: {
    openControl: ROOT_CONTROL.ROOM_CONTROL_BLIND_OPEN,
    closeControl: ROOT_CONTROL.ROOM_CONTROL_BLIND_CLOSE,
    openRegister: Register.OPEN_BLIND,
    closeRegister: Register.CLOSE_BLIND,
    openEventName: 'blindOpen',
    closeEventName: 'blindClose',
  },
};

export const useWindowControls = (type: WindowControlType) => {
  const dispatch = useDispatch();
  const rootControl = useSelector((state: any) => state.rootControl.rootControl);
  const { onSetActionStatus } = useOnSetActionStatus();
  const imageRef = useRef<HTMLDivElement>(null);

  const config = CONTROL_CONFIGS[type];

  const [stop, setStop] = useState(false);
  const [stopClose, setStopClose] = useState(false);

  const stopTimeout = useRef<NodeJS.Timeout | null>(null);
  const stopCloseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stopClose) {
      stopCloseTimeout.current = setTimeout(() => {
        setStopClose(false);
      }, 3000);
    }
    return () => {
      if (stopCloseTimeout.current) {
        clearTimeout(stopCloseTimeout.current);
      }
    };
  }, [stopClose]);

  useEffect(() => {
    if (stop) {
      stopTimeout.current = setTimeout(() => {
        setStop(false);
      }, 3000);
    }
    return () => {
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
      }
    };
  }, [stop]);

  const onUp = useCallback(() => {
    if (stop || stopClose) return;
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch, stop, stopClose]);

  const onBack = useCallback(() => {
    if (stop || stopClose) return;
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch, stop, stopClose]);
  

  const onLeftFromOpen = useCallback(() => {
    if (stop || stopClose) return;

    if (rootControl === config.closeControl) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
      return;
    }
    dispatch(setRootControl(config.closeControl));
  }, [dispatch, rootControl, stop, stopClose]);

  const onRightFromClose = useCallback(() => {
    if (stop || stopClose) return;

    if (rootControl === config.openControl) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
      return;
    }
    dispatch(setRootControl(config.openControl));
  }, [dispatch, rootControl, stop, stopClose, config.openControl]);

  const onRightFromOpen = useCallback(() => {
    if (stop || stopClose) return;
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_LIST));
  }, [dispatch, rootControl, stop, stopClose, config.openControl]);

  const onOpen = useCallback(async () => {
    if (stop) {
      await onSetActionStatus(config.openRegister, false);
      setStop(false);
      clearTimeout(stopTimeout.current!);
      return;
    }

    await onSetActionStatus(config.openRegister, true);
    if (type === 'curtain') {
      imageRef.current?.classList.add("show");
    }
    window.dispatchEvent(new CustomEvent(config.openEventName));
    setStop(true);
  }, [onSetActionStatus, setStop, stop, stopTimeout, config.openRegister, config.openEventName, type]);

  const onClose = useCallback(async () => {
    if (stopClose) {
      await onSetActionStatus(config.closeRegister, false);
      setStopClose(false);
      clearTimeout(stopCloseTimeout.current!);
      return;
    }

    await onSetActionStatus(config.closeRegister, true);
    if (type === 'curtain') {
      imageRef.current?.classList.add("hide");
    }
    window.dispatchEvent(new CustomEvent(config.closeEventName));
    setStopClose(true);
  }, [onSetActionStatus, setStopClose, stopClose, stopCloseTimeout, config.closeRegister, config.closeEventName, type]);

  return {
    imageRef,
    rootControl,
    onUp,
    onBack,
    onLeftFromOpen,
    onRightFromClose,
    onOpen,
    onClose,
    stop,
    stopClose,
    onRightFromOpen,
  };
};

