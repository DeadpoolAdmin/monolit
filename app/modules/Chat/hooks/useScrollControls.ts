import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useQuickMessage } from "./useQuickMessage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";

export const useScrollControls = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState<number>(0);
    const rootControl = useSelector((state : any) => state.rootControl.rootControl);

    const navigate = useNavigate();

    const clickToScrollUp = useCallback(() => {
        window.dispatchEvent(new CustomEvent('scroll-up'));
    }, [])

    const clickToScrollDown = useCallback(() => {
        window.dispatchEvent(new CustomEvent('scroll-down'));
    }, [])

    const { quicks } = useQuickMessage();

    const controls = {
        isActive: rootControl === ROOT_CONTROL.CHAT_SCROLL,
        id: 'scroll-controls',
        debounce: 100,

        left: () => {
            if (index > 0) {
                setIndex(index - 1);

                return;
            }

            if (quicks.length === 0) {
                return;
            }

            dispatch(setRootControl(ROOT_CONTROL.CHAT_QUICK))
        },
        ok: () => {
            if (index == 0) {
                clickToScrollUp()

                return
            }

            clickToScrollDown();
        },
        down: () => {
            dispatch(setRootControl(ROOT_CONTROL.CHAT_SEND))
        },
        right: () => {
            if (index < 1) {
                setIndex(index + 1);

                return;
            }
        },
        back: () => {
            navigate(-1);
        }
    }

    useKeydown(controls)

    return {
        index,
        clickToScrollUp,
        clickToScrollDown,
    }
}