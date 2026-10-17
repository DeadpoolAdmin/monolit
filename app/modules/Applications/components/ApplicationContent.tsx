import React, { useEffect } from "react";
import { GridView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useNavigate } from "react-router-dom";
import { useLazyGetApplicationsQuery } from "@/services/Settings/SettingsApi";
import useAspectRatio from "@/shared/hooks/useAspectRatio";
import { Application } from "../types/application.types";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import QueryWrapper from "@/shared/components/QueryWrapper";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import ApplicationsListItem from "./ApplicationsItem";
import ScrollView from "@/shared/components/ScrollView/ScrollView";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
// import { useGetApplicationsMutation } from "@/redux/services/ApplicationsApi";
// import Loader from "./Loader/Loader";

// const ScrollView = React.lazy(() => import("scrollView/ScrollView"));

const ApplicationsContent = () => {
  const { getDeviceType } = useResolution();

  const [getApplications] =
    useLazyGetApplicationsQuery();

  const deviceType = getDeviceType();

  const { getDimensions } = useAspectRatio(41);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [apps, setApps] = React.useState<Application[]>([]);

  const [showEmpty, setShowEmpty] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  const rootControl = useSelector((state: any) => state.rootControl.rootControl)

  const onFetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await getApplications({}).unwrap();

      if (!response) {
        setShowEmpty(true);
        setIsLoading(false);
        return;
      }

      setApps( response.rows || []);
      setShowEmpty(false);
      setIsLoading(false);
    } catch (error) {
      setShowEmpty(true);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    onFetchApplications();

    dispatch(setRootControl(ROOT_CONTROL.APPLICATIONS))
  }, []);

  const openApp = (item: Application) => {
    const globalThis = window as any;

    if (globalThis.Android) {

      globalThis.Android.launchApp(item.applicationId);
    }
    else if (globalThis.tizen) {
      try {
        
        globalThis.tizen.application.launch(
          item.tizenApplicationId,
          () => console.log("launched!", item.tizenApplicationId),
          (err: any) => {
            console.error("Exception:", err);
          }
        );
      } catch (e) {
        console.error("Exception:", e);
      }
    }
  };

  const navigate = useNavigate();

  const onUp = () => {
    dispatch(setPrevRootControl(rootControl))
    dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
  };

  const controls = {
    isActive: deviceType === 'TABLET',
    id: 'applications-content-control',
    back : () => {
      navigate(`/menu`);
    }
  }

  useKeydown(controls)

  return (
    <QueryWrapper
      isLoading={isLoading}
      isEmpty={!apps || apps.length === 0}
    >
      <div className="applications__content">
      <div
        className="applications__list"
        style={{
          marginLeft: deviceType === "TV" ? "8rem" : "10rem",
          height: deviceType === 'TV' ? 'var(--screen-height)' : '80%',
          scrollbarWidth: deviceType === 'TV' ? 'none' : 'auto',
        }}
      >
        {deviceType === "TV" ? (
          <GridView
            id="applications-grid-view"
            uniqueKey="list-"
            nativeControle={true}
            isActive={rootControl === ROOT_CONTROL.APPLICATIONS}
            rowItemsCount={4}
            data={apps}
            bufferStart={10}
            bufferEnd={10}
            itemWidth={getDimensions().width}
            rowGap={5}
            gap={4}
            itemHeight={getDimensions().height}
            debounce={200}
            initialActiveIndex={0}
            direction="ltr"
            onMouseEnter={() => {}}
            onChangeRow={() => {}}
            onUp={onUp}
            onDown={() => {}}
            onOk={(item) => openApp(item)}
            onBack={() => {
              navigate(`/menu`);
            }}
            renderItem={({
              item,
              style,
              isActive,
              key,
            }: {
              item: Application;
              style: React.CSSProperties;
              isActive: boolean;
              key: string;
            }) => (
              <ApplicationsListItem
                isActive={isActive}
                key={key}
                item={item}
                style={style}
                openApp={openApp}
              />
            )}
          />
        ) : (
          <ScrollView
            data={apps}
            width={182}
            dimension={"rem"}
            listType={"grid"}
            type={"grid"}
            renderItem={({ style, item, isActive, key }) => (
              <ApplicationsListItem
                isActive={isActive}
                openApp={openApp}
                key={key}
                item={item}
                style={{
                  ...style,
                  width: getDimensions().width + "rem",
                  height: getDimensions().height + "rem",
                  margin: "1rem",
                }}
              />
            )}
          />
        )}
      </div>
      </div>
    </QueryWrapper>
  );
};

export default ApplicationsContent;
