import React, { useCallback, useEffect, useRef, useState } from "react";
import Logo from "./components/Logo";

import "./styles/index.scss";
import Content from "./components/Content";
import { useDeviceInfo } from "@/shared/functions/deviceInfo";
import { useDevice } from "./hooks/useDevice";
import { DeviceInfo } from "@/shared/types/DeviceInfo";
import { useNavigate } from "react-router-dom";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { useRegisterDevice } from "./hooks/useRegisterDevice";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSignageScreens } from "@/shared/hooks/signage/useSignageScreens";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDevice } from "@/slices/DeviceInfo";
import { useUpdateDeviceInfo } from "@/shared/hooks/useUpdateDeviceInfo";
import { useGetLanguages } from "@/shared/hooks/mutations/useGetLanguages";

export const Activation = () => {
  const { getDeviceInfo } = useDeviceInfo();

  const { onAddDevice, addDeviceError } = useDevice();
  const { onRegisterDevice } = useRegisterDevice();

  const deviceType = useResolution().getDeviceType();

  // const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo | null>(null);
  const [message, setMessage] = React.useState<string>("");

  const addDeviceInterval = useRef<NodeJS.Timeout | null>(null);
  const registerTimout = useRef<NodeJS.Timeout | null>(null);
  const addDeviceTimeout = useRef<NodeJS.Timeout | null>(null);
  const signageInterval = useRef<NodeJS.Timeout | null>(null);

  const { getLanguagesData } = useGetLanguages();

  const navigate = useNavigate();

  const searchParams = usePolyfillSearchParams();

  const [code, setCode] = useState<string>("");

  const { onGetSignageScreens } = useSignageScreens();

  const dispatch = useDispatch();

  const device = useSelector((state: any) => state.deviceInfo?.device);

  const { updateDeviceInfoData } = useUpdateDeviceInfo();

  const addDevice = useCallback(async () => {
    try {
      if (device) {
        const response = await onAddDevice(device.deviceId);

        if (!response) {
          setMessage("Device is not active");

          return;
        }

        setMessage(response.message);

        if ("accessToken" in response) {
          localStorage.setItem("token", response.accessToken);
          localStorage.setItem("deviceId", device.deviceId);

          updateDeviceInfoData();

          if (deviceType === "SIGNAGE") {
            onGetSignageScreens();

            return;
          }

          const search = searchParams.toString();

          getLanguagesData().then((data) => {
            if (data && data.length == 1) {
              localStorage.setItem("lang", data[0].code);

              navigate(`/welcome${search ? `?${search}` : ""}`);
            } else {
              

              navigate(`/languages${search ? `?${search}` : ""}`);
            }
          });

          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [device, onAddDevice, navigate]);

  const onGetDeviceInfo = useCallback(() => {
    getDeviceInfo()
      .then((deviceInfo: DeviceInfo) => {
        setTimeout(() => {
          dispatch(setDevice(deviceInfo));
        }, 2000); // Show loader for 2 seconds when deviceInfo is ready
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }, [getDeviceInfo]);

  const registerDevice = useCallback(async () => {
    try {
      if (device) {
        const response = await onRegisterDevice(
          device,
          deviceType === "SIGNAGE"
            ? "signage"
            : deviceType === "TABLET"
            ? "tablet"
            : "tv"
        );

        setCode(response.code);
      }
    } catch (e) {
      console.log(e);
    }
  }, [device, onRegisterDevice]);

  useEffect(() => {
    onGetDeviceInfo();

    return () => {
      // cleanup macrotasks
      clearTimeout(addDeviceTimeout.current as NodeJS.Timeout);
      clearInterval(addDeviceInterval.current as NodeJS.Timeout);
      clearTimeout(registerTimout.current as NodeJS.Timeout);
      clearInterval(signageInterval.current as NodeJS.Timeout);
    };
  }, []);

  useEffect(() => {
    if (addDeviceError || message === "Device is not active") {
      addDeviceInterval.current = setInterval(() => {
        addDevice();
      }, 3000);
    }

    return () => {
      clearInterval(addDeviceInterval.current!);
    };
  }, [addDeviceError, message]);

  useEffect(() => {
    if (device) {
      clearTimeout(registerTimout.current as NodeJS.Timeout);

      registerTimout.current = setTimeout(() => {
        registerDevice();
      }, 2000);
    }

    return () => {
      clearTimeout(registerTimout.current as NodeJS.Timeout);
    };
  }, [device]);

  useEffect(() => {
    clearTimeout(addDeviceTimeout.current as NodeJS.Timeout);

    addDeviceTimeout.current = setTimeout(() => {
      addDevice();
    }, 5000);
  }, [device]);

  return (
    <div className="activation">
      <div className="activation__space">
        <Logo />
        {<Content code={code} />}
      </div>
    </div>
  );
};
