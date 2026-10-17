
import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuickMessage } from "./useQuickMessage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setPrevRootControl, setRootControl } from "@/slices/RootControlSlice";

export const useContentInputControl = ({ setIsOpen }: { setIsOpen: (value: boolean) => void }) => {
    const navigate = useNavigate();
    const { quicks } = useQuickMessage();

    const rootControl = useSelector((state : any) => state.rootControl.rootControl);

    const contentInputRef = useRef<HTMLInputElement>(null);
    const prevHeightRef = useRef(window.innerHeight);

    const dispatch = useDispatch();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleResize = () => {
            const newHeight = window.innerHeight;
            const prevHeight = prevHeightRef.current;
            const difference = newHeight - prevHeight;

            const footer = document.querySelector('.body__footer') as HTMLElement | null;
            const options = document.querySelector('.message__body__options') as HTMLElement | null;
            const body__content = document.querySelector('.body__content') as HTMLElement | null;

            if (footer) {

                if (difference !== 0) {
                    footer.style.top = (difference - footer.offsetHeight - 42) / 9 + 'rem';
                }
                else {
                    footer.style.top = '0';
                }
            }

            if (options) {
                if (difference !== 0) {
                    options.style.top = (difference - options.offsetHeight - 42) / 7 + 'rem';
                }
                else {
                    options.style.top = '0';
                }
            }

            if (body__content) {
                if (difference !== 0) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                        body__content.style.opacity = '0.3';
                    }, 100);
                }
                else {
                    if (body__content.style.opacity !== '1') {
                        body__content.style.opacity = '1';
                    }
                }
            }


        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [prevHeightRef]);


    const controls = {
        id: 'content-input-control',
        isActive: rootControl === ROOT_CONTROL.TYPE_MESSAGE,
        ok: () => {
            if (contentInputRef.current) {
                // Always blur instead of focus, just open the keyboard
                contentInputRef.current.blur();
                setIsOpen(true);
                dispatch(setPrevRootControl(rootControl))
                dispatch(setRootControl(ROOT_CONTROL.CHAT_KEYBOARD_OPEN));
            }
        },
        back: () => {
            if (document.activeElement === contentInputRef.current) {
                contentInputRef.current?.blur();
            }
            else {
                navigate(-1);
            }
        },
        right: () => {
            if (document.activeElement === contentInputRef.current) {
                contentInputRef.current?.blur();
            }

            dispatch(setRootControl(ROOT_CONTROL.CHAT_SEND));
        },
        up: () => {

            if (document.activeElement === contentInputRef.current) {
                contentInputRef.current?.blur();
            }

            // Check if quick messages are empty, if so dispatch SCROLL instead of QUICK
            if (quicks.length === 0) {
                dispatch(setRootControl(ROOT_CONTROL.CHAT_SCROLL));
            } else {
                dispatch(setRootControl(ROOT_CONTROL.CHAT_QUICK));
            }
        }
    }

    useKeydown(controls)

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, [rootControl])

    return {
        contentInputRef
    }
}