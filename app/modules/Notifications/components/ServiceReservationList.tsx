import React, { memo, useCallback, useMemo } from "react";
import { INotification } from "../types/Notification.type";

import { ListGridView } from "smarters-ino-ui-tv";
import "smarters-ino-ui-tv/dist/main.css";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector, useDispatch } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { setSelectedDates, SelectedDateData } from "@/slices/ReservationPopup/selected_dates";
import { IoCalendarOutline } from "react-icons/io5";
import { setRootControl } from "@/slices/RootControlSlice";
import { useResolution } from "@hotel-smarters/resolution-hook";
import ScrollGridView from "@shared/components/ScrollGridView";

const ServiceReservationList = ({ data }: { data: INotification }) => {
  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const selectedDates = useSelector(
    (state: any) => state.selectedDates.selectedDates
  );

  const deviceType = useResolution().getDeviceType();

  // Transform object to ListGridView CategoryData format
  const availableTimeData = useMemo(() => {
    if (!data.availableTimeOptions) return [];

    const transformed = Object.entries(data.availableTimeOptions).map(
      ([dateKey, times]) => {
        let formattedDate = new Date(dateKey).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();

        // Create unique identifiers by combining date and time
        const uniqueTimes = times.map(time => `${dateKey}|${time}`);

        return {
          id: dateKey,
          title: dateKey,
          list: uniqueTimes,
          name: (
            <>
              <IoCalendarOutline />
              <span style={{marginLeft: '1rem'}}>{formattedDate}</span>
            </>
          ),
        };
      }
    );
    return transformed;
  }, [data.availableTimeOptions]);

  // Transform data for ScrollGridView (tablet/mobile)
  const scrollGridData = useMemo(() => {
    if (!data.availableTimeOptions) return {};

    const transformed: { [key: string]: { header: React.ReactNode; items: string[] } } = {};
    
    Object.entries(data.availableTimeOptions).forEach(([dateKey, times]) => {
      let formattedDate = new Date(dateKey).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1).toLowerCase();
      
      const header = (
        <>
          <IoCalendarOutline />
          <span style={{marginLeft: '1rem'}}>{formattedDate}</span>
        </>
      );
      
      // Create unique identifiers by combining date and time
      transformed[dateKey] = {
        header,
        items: times.map(time => `${dateKey}|${time}`)
      };
    });
    
    return transformed;
  }, [data.availableTimeOptions]);

  const dispatch = useDispatch();

  const controls = useMemo(() => {
    return {
      isActive:
        rootControl === ROOT_CONTROL.NOTIFICATIONS_SERVICE_AVAILABLE_TIME,
      id: "available__time__options",
      //   down : () => {
      //     dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_SERVICE_SEND_REQUEST));
      //   }
    };
  }, [rootControl]);

  useKeydown(controls);

  const toggleOnOk = useCallback(
    (item: string) => {
      // Single selection: toggle on/off if same item, otherwise select new item
      if (selectedDates?.fullIdentifier === item) {
        // Deselect if clicking the same item
        dispatch(setSelectedDates(null));
      } else {
        // Parse the item to get date and time
        const [date, time] = item.split('|');
        const selectedData: SelectedDateData = {
          date,
          time,
          fullIdentifier: item
        };
        // Select the new item
        dispatch(setSelectedDates(selectedData));
      }
    },
    [dispatch, selectedDates]
  );

  const onDown = useCallback(() => {
    dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS_SERVICE_SEND_REQUEST));
  }, [dispatch]);

  return (
    data.availableTimeOptions && (
      <div className="reject__popup__available__time__options">
        {
            deviceType === 'TV' ? (
                <ListGridView
                data={availableTimeData}
                rowsCount={availableTimeData.length}
                visibleRowsCount={availableTimeData.length}
                
                rowGap={10}
                gap={2}
                withTitle={true}
                isActive={
                  rootControl === ROOT_CONTROL.NOTIFICATIONS_SERVICE_AVAILABLE_TIME
                }
                id="available__time__options"
                itemsCount={availableTimeData.reduce(
                  (sum, category) => sum + category.list.length,
                  0
                )}
                itemsTotal={availableTimeData.reduce(
                  (sum, category) => sum + category.list.length,
                  0
                )}
                buffer={5}
                itemWidth={17}
                itemHeight={6}
                startScrollIndex={2}
                onDown={onDown}
                onOk={(item) => toggleOnOk(item)}
                renderItem={({ item, style, isActive, key }) => {
                  // Extract the time part from the unique identifier (dateKey|time)
                  const timeDisplay = item.split('|')[1] || item;
                  const isSelected = selectedDates?.fullIdentifier === item;
                  
                  return (
                    <div
                      key={key}
                      className={`available__time__option ${isActive ? "active" : ""} ${
                        isSelected ? "selected" : ""
                      }`}
                      style={style}
                    >
                      <span>{timeDisplay}</span>
                    </div>
                  );
                }}
              />
            )

            :

            (
              <ScrollGridView
                data={scrollGridData}
                itemWidth={17}
                itemHeight={6}
                style={{
                    marginTop: '3rem',
                    height: "85%"
                }}
                gap={2}
                renderItem={(item) => {
                  // Extract the time part from the unique identifier (dateKey|time)
                  const timeDisplay = item.split('|')[1] || item;
                  const isSelected = selectedDates?.fullIdentifier === item;
                  
                  return (
                    <div
                      className={`available__time__option ${isSelected ? "selected" : ""}`}
                      onClick={() => toggleOnOk(item)}
                      style={{
                        marginTop: '1rem',
                        height: '6rem'
                      }}
                    >
                      <span>{timeDisplay}</span>
                    </div>
                  );
                }}
              />
            )
        }
        
      </div>
    )
  );
};

export default memo(ServiceReservationList);
