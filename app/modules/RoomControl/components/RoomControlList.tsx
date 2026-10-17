import React, { useState, useCallback, useEffect, useMemo, memo } from "react";
import { GridView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";

import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector } from "react-redux";
import RoomControlListItem from "./RoomControlListItem";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { useDispatch } from "react-redux";
import { SmartDeviceType } from "../types/room_control.enum";
import { useNavigate } from "react-router-dom";
import { useOnSetActionStatus } from "../hooks/useOnSetActionStatus";

interface RoomControlListProps {
  list: any[];
}

const RoomControlList = ({ list }: RoomControlListProps) => {
  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { onSetActionStatus } = useOnSetActionStatus();
  

  // Track which items are toggled on (using item IDs)
  const [toggledItems, setToggledItems] = useState<Set<string>>(new Set());

  // Initialize toggled items based on their status from backend
  useEffect(() => {
    const initialToggledItems = new Set<string>();
    list.forEach((item) => {
      if (item.status === true && item.id) {
        initialToggledItems.add(item.id.toString());
      }
    });
    setToggledItems(initialToggledItems);
  }, [list]);

  // Handle toggling an item on/off
  const handleToggleItem = useCallback((item: any) => {
    // Special handling for temperature - change rootControl
    if (item.name === SmartDeviceType.temperature) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_TEMPERATURE_CONTROLS));
      return;
    }

    if(item.name === SmartDeviceType.curtain) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_CURTAIN_OPEN));
      return;
    }

    if(item.name === SmartDeviceType.blind) {
      dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_BLIND_OPEN));
      return;
    }

    const itemId = item.id?.toString();
    if (!itemId) return;

    // Check if item is currently toggled before updating
    const isCurrentlyToggled = toggledItems.has(itemId);

    setToggledItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        
        if('onOff' in item && item.onOff?.registerToAction) {
          onSetActionStatus(item.onOff.registerToAction, false);
        }

      } else {
        newSet.add(itemId);

        if('onOff' in item && item.onOff?.registerToAction) {
          onSetActionStatus(item.onOff.registerToAction, true);
        }
      }
      return newSet;
    });

    // Move dispatch outside of setState callback to prevent render phase updates
    if(!isCurrentlyToggled && item.name === SmartDeviceType.airConditioning) {
      if('onOff' in item && item.onOff?.registerToAction) {
        dispatch(setRootControl(ROOT_CONTROL.ROOM_CONTROL_CONDITIONER));
      }
    }
  }, [dispatch, onSetActionStatus, toggledItems]);



  // Check if an item is toggled on
  const isItemToggled = useCallback((itemId: string) => {
    return toggledItems.has(itemId);
  }, [toggledItems]);

  const onUp = useCallback(() => {
    dispatch(setPrevRootControl(rootControl));
    dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK));
  }, [dispatch, rootControl]);

  const onBack = useCallback(() => {
    navigate('/menu')
  }, [navigate]);

  // Memoize filtered list to prevent creating new array reference on every render
  const filteredList = useMemo(() => {
    return list.filter((item) => item.visible !== false);
  }, [list]);

  // Memoize renderItem callback to prevent recreating on every render
  const renderItem = useCallback(({ item, style, isActive, key }: { item: any; style: React.CSSProperties; isActive: boolean; key: string }) => (
    <RoomControlListItem
      key={key}
      style={style}
      isActive={isActive}
      item={item}
      isToggled={isItemToggled(item.id?.toString() || '')}
      onToggle={() => handleToggleItem(item)}
    />
  ), [isItemToggled, handleToggleItem]);

  return (
    <GridView
      id="room_control_list"
      uniqueKey="id"
      data={filteredList}
      initialActiveIndex={0}
      bufferStart={8}
      bufferEnd={8}
      itemWidth={56.4}
      itemHeight={34.1}
      gap={2}
      onBack={onBack}
      rowItemsCount={3}
      nativeControle={true}
      scrollOffset={34.1 - 10}
      isActive={rootControl === ROOT_CONTROL.ROOM_CONTROL_LIST}
      onUp={onUp}
      renderItem={renderItem}
    />
  );
};

export default memo(RoomControlList);
