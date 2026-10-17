import React, { useCallback, useEffect, useMemo } from "react";

import cloud from "@/assets/cloud.png";
import furniture from "@/assets/furniture.png";

import { Button } from "@/shared/components/Button/Button";
import { reloadApp } from "@/shared/hooks/useReload";
import { useNavigate } from "react-router";
import { useTranslate } from "@/shared/hooks/languages/useI18";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useDispatch } from "react-redux";
import { setRootControl } from "@/slices/RootControlSlice";

const RoomControlServerIssue = ({
  errorType,
}: {
  errorType: "not_found" | "fetch_error";
}) => {
  const navigate = useNavigate();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const { t } = useTranslate();

  const dispatch = useDispatch();

  const onBack = useCallback(() => {
    navigate("/menu");
  }, [navigate]);

  const controls = useMemo(() => {
    return {
      id: "room_control_server_issue_controls",
      isActive: rootControl === ROOT_CONTROL.ROOM_CONTROL_ERROR_PAGE,
      back: () => {
        onBack();
      },
    };
  }, [rootControl]);

  useKeydown(controls);



  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_ERROR_PAGE));
  }, [dispatch]);


  const icon = useMemo(() => {
    return errorType === "not_found" ? furniture : cloud;
  }, [errorType]);

  return (
    <div className="room_control_error room_control_server_issue" style={{
      marginTop: errorType === "fetch_error" ? undefined : "5rem",
    }}>
      <div className="room_control_server_issue__title">
        <span>
          {errorType === "not_found"
            ? t("noRoomControlsEnabled")
            : t("roomControlServerIssue")}
        </span>
      </div>

      <div className="room_control_server_issue__description">
        <span>
          {errorType === "not_found"
            ? t("thisRoomDoesNotHaveAnyEnabledControlOptions")
            : t(
                "itSeemsYourRoomControlServerIsNotConfiguredCorrectlyInTheAdminPanel"
              )}
        </span>
      </div>

      <div
        className="room_control_server_issue__icon"
        style={{
          width: errorType === "fetch_error" ? "13.3rem" : "46.617rem",
          height: errorType === "fetch_error" ? "13.3rem" : "26.9rem",
          marginTop: errorType === "fetch_error" ? "5.218rem" : "9.4rem",
        }}
      >
        <img src={icon} alt="cloud" />
      </div>

      <div className="room_control_server_issue__button">
        {errorType === "not_found" ? null : (
          <Button
            className="primary active"
            minWidth="33"
            maxWidth="33"
            isActive={rootControl === ROOT_CONTROL.ROOM_CONTROL_ERROR_PAGE}
            ok={reloadApp}
          >
            <span className="button-text">{t("reload")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoomControlServerIssue;
