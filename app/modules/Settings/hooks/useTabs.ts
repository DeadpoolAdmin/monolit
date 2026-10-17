import { setActiveTab } from "@/slices/Settings/TabsSlice"
import { TABS } from "../types"
import { useDispatch } from "react-redux"
import { Dispatch, SetStateAction } from "react"

export const useTabs = (setIndex: Dispatch<SetStateAction<number>>) => {
    const dispatch = useDispatch();

    const onClickLanguages = () => {
        setIndex(0)
        dispatch(setActiveTab(TABS.LANGUAGE))
    }

    const onClickDeviceInfo = () => {
        setIndex(1)
        dispatch(setActiveTab(TABS.DEVICE_INFO))
    }

    const onClickWifiInfo = () => {
        setIndex(2)
        dispatch(setActiveTab(TABS.WIFI_INFO))
    }

    return {
        onClickLanguages,
        onClickDeviceInfo,
        onClickWifiInfo
    }
}