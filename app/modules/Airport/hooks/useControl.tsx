import { setRootControl } from "@/slices/RootControlSlice";
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL"

export const useControl = () => {
    const dispatch = useDispatch();

    const setControl = useCallback((control : typeof ROOT_CONTROL | null) => {
        dispatch(setRootControl(control));
    }, [dispatch])

    return {
        setControl
    }
}