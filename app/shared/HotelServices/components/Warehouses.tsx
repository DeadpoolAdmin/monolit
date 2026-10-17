import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { GridView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";

import dining_error from "@/assets/smarters.png";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import IWarehouse from "../types/warehouse.interface";
import useAspectRatio from "@/shared/hooks/useAspectRatio";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import Loading from "@/shared/components/Loading/Loader";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import ScrollView from "@/shared/components/ScrollView/ScrollView";
import { FaClock } from "react-icons/fa";
import { formatTime } from "@/shared/functions/formatTime";

type WarehousesProps = {
  warehouses: IWarehouse[];
  warehouseLoading: boolean;
  warehouseError: boolean;
};

const Warehouses = React.memo<WarehousesProps>(
  ({ warehouses, warehouseLoading }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { getDimensions } = useAspectRatio(56.1);
    const { getDeviceType } = useResolution();
    const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

    const deviceType = useMemo(() => getDeviceType(), [getDeviceType]);
    const dimensions = useMemo(() => getDimensions(), [getDimensions]);

    const [activeIndex, setActiveIndex] = useState(0);

    const searchParams = usePolyfillSearchParams();
    const type = useMemo(() => searchParams.get("type"), [location.search]);

    const rootControl = useSelector(
      (state: any) => state.rootControl.rootControl
    );

    const goBack = useCallback(() => {
      if (activeIndex > 0) {
        setActiveIndex(0);
      } else {
        navigate(-1);
      }
    }, [activeIndex, navigate, rootControl]);

    const controls = useMemo(
      () => ({
        isActive: rootControl === ROOT_CONTROL.HOTEL_SERVICES,
        id: "service-controls",
        back: goBack,
      }),
      [goBack]
    );

    const onUp = useCallback(() => {
      dispatch(setPrevRootControl(rootControl));

      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    }, [rootControl]);

    useEffect(() => {
      dispatch(setRootControl(ROOT_CONTROL.HOTEL_SERVICES));
    }, []);

    useKeydown(controls);

    const navigateService = useCallback(
      (item: IWarehouse) => {
        if (item?.departmentId) {
          localStorage.setItem("departmentId", item.departmentId.toString());
        }
        if (item?.id) {
          localStorage.setItem("departmentUnitId", item.id.toString());
        }

        navigate(`categories?type=${type}`);
      },
      [navigate, type]
    );

    return warehouseLoading ? (
      <Loading />
    ) : warehouses && warehouses.length > 0 ? (
      <div
        className="warehouses__list"
        style={{
          height: deviceType === "TV" ? "var(--screen-height)" : "95%",
          overflowY: deviceType === "TV" ? "hidden" : "auto",
          scrollbarWidth: "none",
        }}
      >
        {deviceType === "TV" ? (
          <GridView
            id="warehouses"
            data={warehouses}
            isActive={rootControl === ROOT_CONTROL.HOTEL_SERVICES}
            gap={2}
            onUp={onUp}
            initialActiveIndex={0}
            nativeControle={true}
            bufferStart={5}
            rowItemsCount={3}
            scrollOffset={26.3}
            onOk={(item) => navigateService(item)}
            itemWidth={57.1}
            onIndexChange={(index) => setActiveIndex(index)}
            activeIndex={activeIndex}
            itemHeight={26.3}
            renderItem={({ item, style, isActive, key }) => (
              <div
                onClick={() => navigateService(item)}
                key={key}
                className={`services__item ${isActive ? "active" : ""}`}
                style={style}
              >
                <div
                  className="background"
                  style={{
                    background: isActive ? "black" : "transparent",
                    width: "100%",
                    height: "100%",
                    transition: "background .2s ease",
                    opacity: 0.4,
                    borderRadius: "2rem",
                  }}
                ></div>
                <img
                  className="item__image"
                  onError={(e: any) => (e.target.src = dining_error)}
                  src={getUrl(item.image)}
                  alt={item.name}
                />
                <div className="services__item__name">{item.name}</div>
                {
                  item.availableHours && (
                    <div className="services__item__working__times">
                      <FaClock />
                      {item.availableHours.map((hour: { id?: string | number; open: string; close: string }) => (
                        <div className="services__item__working__times__item" key={hour.id || hour.open + hour.close}>{formatTime(hour.open)} - {formatTime(hour.close)}</div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          />
        ) : (
          <ScrollView
            data={warehouses}
            width={180}
            dimension={"vh"}
            listType={"grid"}
            type={"gird-movies"}
            renderItem={({
              item,
              style,
              isActive,
              key,
            }: {
              item: IWarehouse;
              style: React.CSSProperties;
              isActive: boolean;
              key: React.Key;
            }) => (
              <div
                onClick={() => navigateService(item)}
                key={key}
                className={`services__item ${isActive ? "active" : ""}`}
                style={{
                  ...style,
                  width: dimensions.width + "rem",
                  height: dimensions.height + "rem",
                  margin: "1rem 1rem",
                }}
              >
                <img
                  className="item__image"
                  onError={(e: any) => (e.target.src = dining_error)}
                  src={getUrl(item.image)}
                  alt={item.name}
                />
                <div className="services__item__name">{item.name}</div>
                {
                  item.availableHours && (
                    <div className="services__item__working__times">
                      <FaClock />
                      {item.availableHours.map((hour: { id?: string | number; open: string; close: string }) => (
                        <div className="services__item__working__times__item" key={hour.id || hour.open + hour.close}>{formatTime(hour.open)} - {formatTime(hour.close)}</div>
                      ))}
                    </div>
                  )
                }
              </div>
            )}
          />
        )}
      </div>
    ) : (
      <></>
    );
  }
);

Warehouses.displayName = "Warehouses";

export default Warehouses;
