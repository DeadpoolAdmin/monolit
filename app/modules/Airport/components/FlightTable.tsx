import React, { memo } from "react";
import { FaPlane } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { FlightTableData } from "../types/flight.interface";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { TABS_FLIGHT } from "../types/tabs.flight.interface";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useActiveTable } from "../hooks/useActiveTable";
import { useTableControl } from "../hooks/useTableControl";
import { useTranslate } from "@/shared/hooks/languages/useI18";

interface FlightTableProps {
  arrivals: FlightTableData[];
  departures: FlightTableData[];
  isLoading: boolean;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  currentPage?: number;
}

const FlightTable: React.FC<FlightTableProps> = ({
  arrivals,
  departures,
  onNextPage,
  onPrevPage,
  currentPage,
}) => {
  const tab = useSelector((state: any) => state.flightTab.activeTab);

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  useActiveTable();

  const { index, tableRef, containerRef } = useTableControl({
    flightTable: tab === TABS_FLIGHT.DEPARTURES ? departures : arrivals,
    onNextPage,
    onPrevPage,
    itemsPerPage: deviceType === "TV" ? 7 : 1000,
    currentPage,
  });

  const rootControl = useSelector(
    (state: any) => state.rootControl.rootControl
  );

  const { t } = useTranslate();

  return (
    <div
      className="flight-table"
      ref={containerRef}
      style={{
        height: getDeviceType() === "TV" ? "73rem" : "70%",
        overflow: getDeviceType() === "TABLET" ? "auto" : "hidden",
        scrollbarWidth: "none",
      }}
    >
      <table ref={tableRef}>
        <thead>
          <tr>
            <th></th>
            <th>{t('time')}</th>
            <th>{t('destination')}</th>
            <th>{t('flight')}</th>
            <th>{t('gate')}</th>
            <th>{t('remarks')}</th>
          </tr>
        </thead>

        <tbody>
          {(tab === TABS_FLIGHT.DEPARTURES ? departures : arrivals).map(
            (data, i) => (
              <tr
                key={i}
                className={
                  rootControl === ROOT_CONTROL.FLIGHT_TABLE &&
                  i === index &&
                  getDeviceType() === "TV"
                    ? "active"
                    : ""
                }
              >
                <td className="plane-icon">
                  <FaPlane />
                </td>
                <td className="time-cell">
                  {data.time}{" "}
                  {tab === TABS_FLIGHT.DEPARTURES
                    ? data.departure_time
                    : data.arrival_time}
                </td>
                <td className="destination-cell">{data.destination}</td>
                <td className="flight-cell">
                  {" "}
                  {data.flight && data.flight.includes("null")
                    ? "N/A"
                    : data.flight}
                </td>
                <td className="gate-cell">{data.gate}</td>
                <td
                  className={`remarks-cell ${data?.remarks
                    ?.toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {data.remarks ? data.remarks.toUpperCase() : "N/A"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default memo(FlightTable);
