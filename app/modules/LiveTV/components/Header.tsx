import React from "react";

import { FaSearch, FaTv } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTabControl } from "../hooks/useTabControl";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { TABS } from "../types/livetv.tabs";
import Back from "@/layout/Header/components/Back/Back";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { index, onChooseTab } = useTabControl();
  const activeTab = useSelector((state: any) => state.liveTvTabs.selectedTab);
  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const deviceType = useResolution().getDeviceType();

  const navigate = useNavigate();

  return (
    <div className="sidebar__header">
      {deviceType === "TABLET" && (
        <Back
          style={{
            position: "absolute",
            top: "3rem",
            left: "4rem",
          }}
          isActive={false}
          onClick={() => {
            if(window.Android) {
              navigate("/menu");
            }
          }}
        />
      )}

      <div
        className={`sidebar__header_item ${
          index === 0 && rootControl === ROOT_CONTROL.LIVETV_HEADER
            ? "active"
            : ""
        } ${activeTab === TABS.CHANNELS ? "selected" : ""}`}
        onClick={() => onChooseTab(TABS.CHANNELS)}
      >
        <FaTv />
      </div>

      {/* <div className={`sidebar__header_item ${index === 1 && rootControl === ROOT_CONTROL.LIVETV_HEADER ? 'active' : ''} ${activeTab === TABS.CATEGORIES ? 'selected' : ''}`} onClick={() => onChooseTab(TABS.CATEGORIES)}>
                <FaListUl />
            </div> */}

      <div
        className={`sidebar__header_item ${
          index === 1 && rootControl === ROOT_CONTROL.LIVETV_HEADER
            ? "active"
            : ""
        } ${activeTab === TABS.SEARCH ? "selected" : ""}`}
        onClick={() => onChooseTab(TABS.SEARCH)}
      >
        <FaSearch />
      </div>
    </div>
  );
};

export default Header;
