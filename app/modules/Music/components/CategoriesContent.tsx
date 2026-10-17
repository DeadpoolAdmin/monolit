import React, { useMemo, useCallback } from "react";
import { GridView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { usePolyfillSearchParams } from "@hotel-smarters/polyfill-search-params";
import useAspectRatio from "@/shared/hooks/useAspectRatio";
import Genres from "../types/genres.interface";
import { PCategoriesAll } from "../types/categories.props";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import CategoriesAllItem from "./CategoriesItem";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import ScrollView from "@/shared/components/ScrollView/ScrollView";

const CategoriesAllLists: React.FC<PCategoriesAll> = React.memo(
  ({ all }) => {
    // Redux selectors
    const rootControl = useSelector(
      (state: any) => state.rootControl.rootControl
    );
    const dispatch = useDispatch();

    // Hooks
    const { getDeviceType } = useResolution();
    const navigate = useNavigate();
    const searchParams = usePolyfillSearchParams();
    const { getDimensions } = useAspectRatio(43);

    // Memoize device type to prevent unnecessary re-calculations
    const deviceType = useMemo(() => getDeviceType(), [getDeviceType]);

    // Memoize dimensions to prevent recalculation on every render
    const dimensions = useMemo(() => getDimensions(), [getDimensions]);

    // Memoize navigation function
    const goTo = useCallback(
      (item: Genres) => {
        const search = searchParams.toString();
        navigate(`${item._id}${search ? `?${search}` : ""}`);
        localStorage.setItem("category", JSON.stringify(item));
        dispatch(setRootControl(ROOT_CONTROL.MUSIC_CATEGORIES));
      },
      [navigate, searchParams, dispatch]
    );

    // Memoize control handlers
    const handleUp = useCallback(() => {
      dispatch(setPrevRootControl(rootControl));
      dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
    }, [dispatch, rootControl]);

    const handleBack = useCallback(() => {
      navigate("/menu");
    }, [navigate]);

    // Memoize controls object
    const controls = useMemo(
      () => ({
        isActive: rootControl === ROOT_CONTROL.MUSIC_CATEGORIES,
        id: "music_categories",
        back: handleBack,
      }),
      [rootControl, handleUp, handleBack]
    );

    useKeydown(controls);

    // Memoize render item function
    const renderItem = useCallback(
      ({
        item,
        index,
        style,
        isActive,
        key,
      }: {
        item: Genres;
        index: number;
        style: React.CSSProperties;
        isActive: boolean;
        key: string | number;
      }) => (
        <CategoriesAllItem
          key={key}
          style={style}
          isActive={isActive}
          item={item}
          index={index}
        />
      ),
      []
    );

    // Memoize GridView props
    const gridViewProps = useMemo(
      () => ({
        id: "music__categories__all__lists",
        uniqueKey: "id",
        isActive: rootControl === ROOT_CONTROL.MUSIC_CATEGORIES,
        data: all,
        initialActiveIndex: 0,
        bufferStart: 5,
        bufferEnd: 5,
        rowItemsCount: 4,
        gap: 2,
        scrollOffset: dimensions.height,
        onUp: handleUp,
        itemWidth: dimensions.width,
        itemHeight: dimensions.height,
        nativeControle: true,
        onOk: goTo,
        renderItem,
      }),
      [
        rootControl,
        all,
        dimensions.height,
        dimensions.width,
        // controls.up,
        goTo,
        renderItem,
      ]
    );

    // Memoize container styles
    const containerStyles = useMemo(
      () => ({
        height: "80rem",
        overflow: "hidden" as const,
      }),
      []
    );

    // Early return for empty data
    if (!all.length) {
      return (
        <div className="empty">
          <h1>There is no data</h1>
        </div>
      );
    }

    return (
      <div className="all__lists" style={{...containerStyles,
        height: deviceType === "TV" ? "100%" : "85%",
      }}>
        {deviceType === "TV" ? (
          <GridView {...gridViewProps} />
        ) : (
          <ScrollView
            data={all}
            width={'auto' as any}
            dimension={"rem"}
            type={"list-movies"}
            listType={"grid"}
            renderItem={({
              item,
              itemIndex,
              style,
              isActive,
              key,
            }) => (
              <CategoriesAllItem
                key={key}
                style={{
                  ...style,
                  width: 42 + "rem",
                  height: dimensions.height + "rem",
                  marginLeft: "2rem",
                  marginTop: "2rem",
                }}
                isActive={isActive}
                item={item}
                index={itemIndex ?? 0}
              />
            )}
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better memoization
    return (
      prevProps.all === nextProps.all &&
      prevProps.all.length === nextProps.all.length
    );
  }
);

export default CategoriesAllLists;
