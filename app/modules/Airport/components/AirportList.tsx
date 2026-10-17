import React, { memo, useEffect, useMemo, useState } from "react";
import { ListView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useSelector } from "react-redux";
import { FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import { useAirportData } from "../hooks/useAirportData";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { Airport } from "../types/airport.interface";
import { useChooseAirport } from "../hooks/useChooseAirport";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import Loading from "@/shared/components/Loading/Loader";
import Empty from "@/shared/components/Empty";
import ScrollView from "@/shared/components/ScrollView/ScrollView";

// const ScrollView = React.lazy(() => import('scrollView/ScrollView'));

const AirportList = () => {
  const { airports, loading } = useAirportData();

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  const { chooseAirport } = useChooseAirport();

  const dispatch = useDispatch();

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const searchParams = usePolyfillSearchParams();

  const localStorageAirports = useMemo(() => {
    const chosenAirports = localStorage.getItem("chosenAirports");

    return chosenAirports ? JSON.parse(chosenAirports) : [];
  }, []);

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.AIRPORT_LIST));
  }, []);

  const onUp = () => {
    dispatch(setPrevRootControl(rootControl));
    dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
  };

  const navigate = useNavigate();

  const controls = {
    isActive: rootControl === ROOT_CONTROL.AIRPORT_LIST,
    id: `airport-list-${Date.now()}`,
    back: () => {
      if (activeIndex === 0) {
        const search = searchParams.toString();
        navigate(`/menu${search ? `?${search}` : ""}`);
      } else {
        setActiveIndex(0);
      }
    },
  };

  useKeydown(controls);

  if (loading) {
    return <Loading />;
  }

  if (!airports?.length) {
    return <Empty />;
  }

  return airports?.length ? (
    <div
      className="airport__list"
      style={{
        overflow: deviceType === "TV" ? "hidden" : "auto",
        scrollbarWidth: "none",
        height: deviceType === "TV" ? "55rem" : "85%",
      }}
    >
      {deviceType === "TV" ? (
        <ListView
          data={airports}
          id="cart"
          uniqueKey="cart"
          listType="vertical"
          nativeControle={true}
          itemsCount={6}
          itemsTotal={airports.length}
          gap={2}
          buffer={5}
          itemWidth={100}
          itemHeight={12}
          activeIndex={activeIndex}
          onIndexChange={(index) => setActiveIndex(index)}
          onUp={onUp}
          isActive={rootControl === ROOT_CONTROL.AIRPORT_LIST}
          rowGap={2}
          onOk={(item) => chooseAirport(item.id, item.iata_code)}
          initialActiveIndex={0}
          onBackScrollIndex={null}
          startScrollIndex={1}
          direction="ltr"
          renderItem={({ style, item, isActive, key }) => (
            <div
              onClick={() => chooseAirport(item.id, item.iata_code)}
              className={`airport__item ${isActive ? "active" : ""}`}
              key={key}
              style={style}
            >
              <div className="item__name">{item.airport_name}</div>
              {localStorageAirports?.some((id: Airport) => {
                return id === item.id;
              }) ? (
                <div className="item__favorite">
                  <FaRegStar
                    style={{
                      fontSize: "4rem",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        />
      ) : (
        <ScrollView
          data={airports}
          width={100}
          dimension={"rem"}
          listType={"grid"}
          type={"gird-movies"}
          renderItem={({ item, style, isActive, key }) => (
            <div
              onClick={() => chooseAirport(item.id, item.iata_code)}
              className={`airport__item ${isActive ? "active" : ""}`}
              key={key}
              style={{
                width: 100 + "rem",
                height: 12 + "rem",
                margin: "1rem 0rem",
                ...style,
              }}
            >
              <div className="item__name">{item.airport_name}</div>
              {localStorageAirports?.some((id: string) => {
                return id === item.id;
              }) ? (
                <div className="item__favorite">
                  <FaRegStar
                    style={{
                      fontSize: "4rem",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          )}
        />
      )}
    </div>
  ) : (
    <></>
  );
};

export default memo(AirportList);
