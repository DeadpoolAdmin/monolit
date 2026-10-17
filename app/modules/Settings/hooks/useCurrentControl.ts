import { setSettingCurrentControl } from "@/store/slices/current.control";
import { SETTINGS_CURRENT_CONTROL } from "@/types/current.control.enum";
import { useCallback } from "react";
import { useDispatch } from "react-redux"

export const useCurrentControl = () => {
    const dispatch = useDispatch();

    const setControl = useCallback((control: SETTINGS_CURRENT_CONTROL | null) => {
        dispatch(setSettingCurrentControl(control))
    }, [dispatch])

    return {
        setControl
    }
}