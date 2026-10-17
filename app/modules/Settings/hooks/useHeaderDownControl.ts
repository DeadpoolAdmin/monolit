import { setSettingCurrentControl } from "@/store/slices/current.control";
import { SETTINGS_CURRENT_CONTROL } from "@/types";
import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"

export const useHeaderDownControl = () => {
    const dispatch = useDispatch();

    const onHeaderDownControl = useCallback(() => {
        dispatch(setSettingCurrentControl(SETTINGS_CURRENT_CONTROL.HEADER))
    }, [dispatch])

    useEffect(() => {
        window.addEventListener('headerdowncontrol', onHeaderDownControl)
    }, [onHeaderDownControl])
}