import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const useContentRef = () => {
    const messages = useSelector((state : any) => state.messagesSlice.messages);


    const contentRef = useRef<HTMLDivElement>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleScrollUp = useCallback(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop += -50
        }
    }, [contentRef])

    const handleScrollDown = useCallback(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop += 50
        }
    }, [contentRef])

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
        }, 200)
    }, [messages]);


    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }
    }, [])


    useEffect(() => {
        window.addEventListener("scroll-up", handleScrollUp);
        window.addEventListener("scroll-down", handleScrollDown);

        return () => {
            window.removeEventListener("scroll-up", handleScrollUp);
            window.removeEventListener("scroll-down", handleScrollDown);
        }
    }, [])

    return { contentRef };
};
