import { setSidebarShow } from "@/slices/LiveTV/sidebarShow";
import { useResolution } from "@hotel-smarters/resolution-hook";
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useCallback, useEffect, useMemo, RefObject } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useOnSidebar = (sidebarRef: RefObject<HTMLDivElement>) => {

    const dispatch = useDispatch();

    const deviceType = useResolution().getDeviceType();

    const navigate = useNavigate();

    const onHideSidebar = useCallback(() => {
        if (sidebarRef.current) {
            sidebarRef.current.style.display = 'none';
            dispatch(setSidebarShow(false))
        }
    }, [sidebarRef, dispatch])

    const onShowSidebar = useCallback(() => {
        if (sidebarRef.current) {
            sidebarRef.current.style.display = 'block';
            dispatch(setSidebarShow(true))
        }
    }, [sidebarRef, dispatch])

    const controls = useMemo(() => {
        return {
            isActive: deviceType !== 'TV',
            id: 'on-sidebar',
            back : () => {
                if(sidebarRef.current?.style.display === 'none') return;
                navigate(-1);
            }
        }
    }, [sidebarRef, navigate, deviceType])

    useKeydown(controls)

    useEffect(() => {
        window.addEventListener('hideSidebar', onHideSidebar)
        window.addEventListener('showSidebar', onShowSidebar)

        return () => {
            window.removeEventListener('hideSidebar', onHideSidebar)
            window.removeEventListener('showSidebar', onShowSidebar)
        }
    }, [onHideSidebar, onShowSidebar])
}