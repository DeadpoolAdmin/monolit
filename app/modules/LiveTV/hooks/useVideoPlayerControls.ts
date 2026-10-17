import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL"
import { setRootControl } from "@/slices/RootControlSlice"
import { useKeydown } from "@hotel-smarters/use-key-down-control"
import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

export const useVideoPlayerControls = (
    controlRef: React.RefObject<HTMLDivElement>, 
    visibiltyTimeout: React.MutableRefObject<NodeJS.Timeout | null>
) => {

    const rootControl = useSelector((state: any) => state.rootControl.rootControl)
    const sidebarShow = useSelector((state: any) => state.sidebarShow.sidebarShow)

    const dispatch = useDispatch();

    const timeRef = useRef<NodeJS.Timeout | null>(null)

    // Helper function to start the 5-second timer to hide controls
    const startHideTimer = () => {
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(() => {
            if (controlRef.current && !sidebarShow) {
                controlRef.current.style.display = 'none';
            }
        }, 5000);
    };

    // Helper function to show controls and start timer when sidebar is hidden
    const showControlsAndStartTimer = () => {
        if (!sidebarShow && controlRef.current) {
            controlRef.current.style.display = 'flex';
            startHideTimer();
        }
    };

    const controls = useMemo(() => {
        return {
            id: 'video-player-controls=aaa',
            isActive: rootControl === ROOT_CONTROL.LIVETV_PLAYER,
            back: () => {
                // If sidebar is visible
                if (sidebarShow) {
                    // If controls are NOT 'none', show controls
                    if (controlRef.current && controlRef.current.style.display !== 'none') {
                        controlRef.current.style.display = 'flex';
                        startHideTimer();
                        return;
                    }
                    // If controls are 'none', show sidebar (already visible, but ensure it's focused)
                    window.dispatchEvent(new CustomEvent('showSidebar'));
                    dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT));
                    return;
                }

                // If sidebar is not visible
                if (controlRef.current && controlRef.current.style.display === 'flex') {
                    // If controls are already flex, show sidebar
                    if (timeRef.current) {
                        clearTimeout(timeRef.current);
                    }
                    window.dispatchEvent(new CustomEvent('showSidebar'));
                    dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT));
                    return;
                }

                if (timeRef.current) {
                    clearTimeout(timeRef.current);
                }

                window.dispatchEvent(new CustomEvent('showSidebar'));
                dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT));
            },
            up: () => {
                showControlsAndStartTimer();
            },
            down: () => {
                showControlsAndStartTimer();
            },
            left: () => {
                showControlsAndStartTimer();
            },
            right: () => {
                showControlsAndStartTimer();
            },
            ok: () => {
                showControlsAndStartTimer();
            }
        }
    }, [rootControl, dispatch, sidebarShow])

    useKeydown(controls)

    // Start timer when sidebar becomes hidden and controls are visible
    useEffect(() => {
        if (!sidebarShow && controlRef.current && controlRef.current.style.display === 'flex') {
            startHideTimer();
        } else if (sidebarShow && timeRef.current) {
            // Clear timer when sidebar becomes visible
            clearTimeout(timeRef.current);
            timeRef.current = null;
        }
    }, [sidebarShow]);

    useEffect(() => {
        return () => {
            if (timeRef.current) {
                clearTimeout(timeRef.current);
                timeRef.current = null;
            }
            if (visibiltyTimeout.current) {
                clearTimeout(visibiltyTimeout.current);
                visibiltyTimeout.current = null;
            }
        }
    }, [visibiltyTimeout])

    return {
        showControlsAndStartTimer
    };

}