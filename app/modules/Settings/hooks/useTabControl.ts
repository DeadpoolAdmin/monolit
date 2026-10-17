import { useMemo, useState } from "react"

import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useDispatch } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { useSelector } from "react-redux";
import { TABS } from "../types";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";
import { setActiveTab } from "@/slices/Settings/TabsSlice";
import { useNavigate } from "react-router-dom";

export const useTabControl = () => {

    const [index, setIndex] = useState<number>(0)

    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const activeTab = useSelector((state: any) => state?.tabs?.activeTab);

    const navigate = useNavigate();

    const controls = useMemo(() => {
        return {
            id: 'language',
            isActive: rootControl === ROOT_CONTROL.SETTINGS_HEADER,
            right: () => {
                if (index < 2) {
                    setIndex(index + 1)
                }
            },
            left: () => {
                if (index > 0) {
                    setIndex(index - 1)
                }
            },
            down: () => {
                if (activeTab === TABS.LANGUAGE)
                    dispatch(setRootControl(ROOT_CONTROL.SETTINGS_CONTENT))
            },
            up: () => {
                dispatch(setPrevRootControl(rootControl))
                dispatch(setRootControl(ROOT_CONTROL.HEADER_BACK))
            },
            ok: () => {
                switch (index) {
                    case 0:
                        dispatch(setActiveTab(TABS.LANGUAGE))
                        console.log('language')
                        break;
                    case 1:
                        dispatch(setActiveTab(TABS.WIFI_INFO))
                        console.log('wifi')
                        break;
                    case 2:
                        dispatch(setActiveTab(TABS.DEVICE_INFO))
                        console.log('device')
                        break;
                }
            },
            back : () => {
                if(index === 0) {
                    navigate('/menu')
                }
                else {
                    setIndex(0)
                }
            }
        }
    }, [index, rootControl, activeTab])

    useKeydown(controls);


    return {
        index,
        setIndex
    }
}
