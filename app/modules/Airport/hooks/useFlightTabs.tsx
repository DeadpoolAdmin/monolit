import { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TABS_FLIGHT, TabsFlight } from "../types/tabs.flight.interface";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setActiveTab } from "@/slices/Airports/flightTabSlice";

export const useTabs = () => {
    const activeTab = useSelector((state: any) => state.flightTab.activeTab);
    const dispatch = useDispatch();

    const tabRef = useRef<HTMLDivElement>(null);

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const onSetActiveTab = useCallback((activeTab: TabsFlight, tabIndex: number, setIndex: (index: number) => void) => {
        dispatch(setActiveTab(activeTab));
        setIndex(tabIndex);
    }, [dispatch, activeTab]);

    useEffect(() => {
        if (activeTab === TABS_FLIGHT.DEPARTURES) {
            tabRef.current?.classList.remove('arrs');
            tabRef.current?.classList.add('deps');

            const flight__tab = document.querySelectorAll('.flight__tab') as NodeListOf<HTMLDivElement>;

            if (tabRef.current) {

                tabRef.current.style.left = `${flight__tab[1].offsetLeft}px`;
                tabRef.current.style.width = `${flight__tab[1].offsetWidth}px`;
            }

        }
        else {
            tabRef.current?.classList.remove('deps');
            tabRef.current?.classList.add('arrs');

            const flight__tab = document.querySelectorAll('.flight__tab') as NodeListOf<HTMLDivElement>;
            if (tabRef.current) {

                tabRef.current.style.left = `${flight__tab[0].offsetLeft}px`;
                tabRef.current.style.width = `${flight__tab[0].offsetWidth}px`;
            }


        }

        if (tabRef.current && rootControl === ROOT_CONTROL.FLIGHT_TABS) {
            tabRef.current.classList.add('active');
        }
        else {
            tabRef.current?.classList.remove('active');
        }
    }, [activeTab, rootControl])

    return {
        activeTab,
        tabRef,
        onSetActiveTab
    }
}