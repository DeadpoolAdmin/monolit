import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL"
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice"
import { useKeydown } from "@hotel-smarters/use-key-down-control"
import { useCallback, useMemo } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export const useInputControl = (inputRef: HTMLInputElement, openKeyboard: boolean, setOpenKeybaord: React.Dispatch<React.SetStateAction<boolean>>) => {
    const rootControl = useSelector((state: any) => state.rootControl.rootControl)

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onClickInput = useCallback(() => {
        inputRef?.blur();
        setOpenKeybaord(true);
        window.keyboard_open = true;
        dispatch(setPrevRootControl(rootControl))
        dispatch(setRootControl(ROOT_CONTROL.CHAT_KEYBOARD_OPEN));
        // Don't set any control when keyboard opens - let keyboard handle its own control
    }, [setOpenKeybaord, dispatch, rootControl])

    const controls = useMemo(() => {
        return {
            id: 'input-control',
            isActive: rootControl === ROOT_CONTROL.LIVETV_SEARCH,
            up: () => {
                dispatch(setRootControl(ROOT_CONTROL.LIVETV_HEADER))
            },
            down: () => {
                dispatch(setRootControl(ROOT_CONTROL.LIVETV_CONTENT))
            },
            ok: () => {
                onClickInput();
            },
            back: () => {
                if(window.Android) {
                    window.Android.destroyPlayer();
                }

                navigate(-1);

            }
        }
    }, [rootControl, onClickInput, dispatch, navigate])

    useKeydown(controls)

    return {
        controls,
        onClickInput,
        openKeyboard
    }
}