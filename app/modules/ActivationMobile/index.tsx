import React, { useEffect } from "react";
import ActivationMobileHeader from "./components/ActivationMobileHeader";
import ActivationMobilePhone from "./components/ActivationMobilePhone";
import { useDispatch } from "react-redux";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useKeydown } from "@hotel-smarters/use-key-down-control";

const ActivationMobile = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.ACTIVATION_MOBILE));
  }, []);

  const controls = {
    isActive: rootControl === ROOT_CONTROL.ACTIVATION_MOBILE,
    id: "activation-mobile",
    back: () => {
      navigate("/menu");
    },
    up: () => {
        dispatch(setPrevRootControl(rootControl))
        dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    }
  };

  useKeydown(controls);

  return (
    <div className="activation__mobile__content">
      <ActivationMobileHeader />
      <ActivationMobilePhone />
    </div>
  );
};

export default ActivationMobile;
