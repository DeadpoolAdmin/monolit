import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control"
import { useNavigate } from "react-router-dom";
import { FlightTableData } from "../types/flight.interface";
import { useControl } from "./useControl";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";

interface TableControlOptions {
    flightTable: FlightTableData[];
    onNextPage?: () => void;
    onPrevPage?: () => void;
    itemsPerPage?: number;
    currentPage?: number;
}

export const useTableControl = (options: TableControlOptions) => {
    const { flightTable, onNextPage, onPrevPage, itemsPerPage = 7, currentPage } = options;
    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const { setControl } = useControl();
    const [index, setIndex] = useState<number>(0);

    const tableRef = useRef<HTMLTableElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const scrollToRow = useCallback(() => {
        if (tableRef && tableRef.current && containerRef && containerRef.current) {
            const tbody = tableRef.current.querySelector('tbody');
            if (tbody && tbody.rows[index]) {
                const row = tbody.rows[index];
                const container = containerRef.current;

                const rowHeight = row.offsetHeight;

                // Start scrolling from index 3, scroll one row at a time, otherwise scroll to top
                const scrollOffset = index >= 3 ? (index - 2) * rowHeight : 0;

                container.scrollTo({
                    top: scrollOffset,
                    behavior: 'smooth'
                });
            }
        }
    }, [index])

    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.FLIGHT_TABLE,
        id: 'AIRPORT_CONTROL.FLIGHT_TABLE',
        up: () => {
            if (index === 0) {
                // If we're on page 1 and at first item, go to flight tabs
                if (currentPage === 1) {
                    setControl(ROOT_CONTROL.FLIGHT_TABS as unknown as typeof ROOT_CONTROL);
                    return;
                }
                // Otherwise try to go to previous page if available
                if (onPrevPage) {
                    onPrevPage();
                    return;
                }
                // Fallback to tabs if no previous page available
                setControl(ROOT_CONTROL.FLIGHT_TABS as unknown as typeof ROOT_CONTROL);
                return;
            }
            setIndex(prev => prev - 1);
        },
        down: () => {
            // If we're at the last item of the current page (index === itemsPerPage - 1)
            if (index === itemsPerPage - 1) {
                // Try to go to next page if available
                if (onNextPage) {
                    onNextPage();
                    return;
                }
            }
            // Otherwise, move to next item if available
            if (index < flightTable.length - 1) {
                setIndex(prev => prev + 1);
            }
        },
        back: () => {
            if (currentPage && currentPage > 1) {
                // If not on page 1, go to previous page
                if (onPrevPage) {
                    onPrevPage();
                }
            } else {
                // If on page 1, navigate back
                navigate(-1);
            }
        }
    }), [index, rootControl, flightTable.length, setControl, scrollToRow, navigate, onNextPage, onPrevPage, itemsPerPage])

    useKeydown(controls)

    useEffect(() => {
        scrollToRow();
    }, [index, scrollToRow])

    // Reset index to 0 when page changes
    useEffect(() => {
        setIndex(0);
    }, [currentPage])

    return {
        index,
        tableRef,
        containerRef,
    }
}