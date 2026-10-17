import { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useNavigate } from "react-router-dom";
import { TABS } from "../types/livetv.tabs";
import { setActiveTab } from "@/slices/LiveTV/liveTvTabs";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";



export const useTabControl = () => {
    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl?.rootControl)

    const [index, setIndex] = useState<number>(0)

    const activeTab = useSelector((state: any) => state.liveTvTabs.selectedTab)

    const navigate = useNavigate()
    

    const onChooseTab = useCallback((tab: TABS) => {
        dispatch(setActiveTab(tab))
    }, [dispatch])

    const controls = useMemo(() => {
        return {
            id: 'tabs-control',
            isActive: rootControl === ROOT_CONTROL.LIVETV_HEADER,
            right: () => {
                // if (index === 2) return
                // setIndex(index + 1)

                if(index === 1) return

                setIndex(index + 1)
            },
            left: () => {
                if (index === 0) return
                setIndex(index - 1)
            },
            down: () => {
                if (activeTab === TABS.SEARCH) {
                    dispatch(setRootControl(ROOT_CONTROL.LIVETV_SEARCH))
                    return
                }
                dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT))
            },
            ok: () => {
                switch (index) {
                    case 0:
                        dispatch(setActiveTab(TABS.CHANNELS))
                        break
                    case 1:
                        // dispatch(setActiveTab(TABS.CATEGORIES))
                        dispatch(setActiveTab(TABS.SEARCH))
                        break
                    case 2:
                        // dispatch(setActiveTab(TABS.SEARCH))
                        break
                }
            },
            back: () => {
                if(window.Android) {
                    window.Android.destroyPlayer();
                }

                navigate(-1)

            }
        }
    }, [rootControl, index, activeTab, navigate])

    useKeydown(controls)

    return {
        index,
        onChooseTab
    }
}