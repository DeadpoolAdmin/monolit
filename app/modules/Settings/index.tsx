import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setActiveTab } from "@/slices/LiveTV/liveTvTabs";
import { setRootControl } from "@/slices/RootControlSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { TABS } from "./types";
import SettingsContent from "./components/SettingsContent";

import './styles/index.scss'

const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.SETTINGS_HEADER));
    return () => {
      dispatch(setActiveTab(TABS.LANGUAGE))
    };
  }, []);

  return (
    <div className="settings">
      <SettingsContent />
    </div>
  );
};

export default Settings;
