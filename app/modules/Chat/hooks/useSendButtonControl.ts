import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuickMessage } from "./useQuickMessage";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";

interface UseSendButtonControlProps {
    sendMessage: () => void;
    message: string;
    contentInputRef: React.RefObject<HTMLInputElement>;
}

export const useSendButtonControl = ({ sendMessage, message, contentInputRef }: UseSendButtonControlProps) => {
    const dispatch = useDispatch();
    const rootControl = useSelector((state : any) => state.rootControl.rootControl);
    const navigate = useNavigate();


    const { quicks } = useQuickMessage();

    const clickToSend = useCallback(() => {
        sendMessage();
    }, [sendMessage, message])

    const controls = {
        id: 'send-button-control',
        isActive: rootControl === ROOT_CONTROL.CHAT_SEND,
        ok: () => {
            if (document.activeElement === contentInputRef.current) {
                contentInputRef.current?.blur();
            }

            clickToSend()
        },
        left: () => {
            dispatch(setRootControl(ROOT_CONTROL.TYPE_MESSAGE))
        },
        back: () => {
            if (document.activeElement === contentInputRef.current) {
                contentInputRef.current?.blur();
            }
            else {
                navigate(-1)
            }
        },
        up: () => {
            if (quicks.length === 0) {
                dispatch(setRootControl(ROOT_CONTROL.CHAT_SCROLL));
            } else {
                dispatch(setRootControl(ROOT_CONTROL.CHAT_QUICK));
            }
        }
    }

    useKeydown(controls);
}