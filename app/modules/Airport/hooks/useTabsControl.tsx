import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useControl } from "./useControl";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setActiveTab } from "@/slices/Airports/flightTabSlice";
import { TABS_FLIGHT } from "../types/tabs.flight.interface";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";

export const useTabsControl = () => {
    const [index, setIndex] = useState<number>(0);

    const { setControl } = useControl();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const controls = useMemo(() => ({
        isActive: rootControl === ROOT_CONTROL.FLIGHT_TABS,
        id: 'ROOT_CONTROL.FLIGHT_TABS',
        debounce: 400,
        left: () => {
            if (index == 1) {
                setIndex(0);
            }
        },
        right: () => {
            if (index == 0) {
                setIndex(1);
            }
        },
        up: () => {
            dispatch(setPrevRootControl(rootControl))
            setControl(ROOT_CONTROL.HEADER_BACK as unknown as typeof ROOT_CONTROL);
        },
        down: () => {
            setControl(ROOT_CONTROL.FLIGHT_TABLE as unknown as typeof ROOT_CONTROL);
        },
        ok: () => {
            if (index == 0) {
                dispatch(setActiveTab(TABS_FLIGHT.ARRIVALS));
            }
            else {
                dispatch(setActiveTab(TABS_FLIGHT.DEPARTURES));
            }
        },
        back: () => {
            if (index === 0) {
                navigate(-1)
            }
            else {
                setIndex(0);
            }
        }
    }), [setControl, rootControl, index, setIndex, navigate]);

    useKeydown(controls)

    return {
        index,
        setIndex,
    }

}