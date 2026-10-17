import { useChatSocket } from "@/shared/hooks/socket/useChatSocket";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useChatOpened = () => {
    const { socketRef } = useChatSocket();

    const location = useLocation();


    const sessionId = new URLSearchParams(location.search).get("departmentId");

    const chatOpened = useCallback(() => {
        if (!sessionId) return;

        socketRef.current?.emit("chatOpened", sessionId);
    }, [sessionId, socketRef]);

    const chatClosed = useCallback(() => {
        if (!sessionId) return;

        socketRef.current?.emit("chatClosed", sessionId);
    }, [sessionId, socketRef]);

    useEffect(() => {
        if (!sessionId) return;


        chatOpened();

        return () => {
            chatClosed();
            console.log('Cleaning up chat opened/closed listeners');
        }
    }, [sessionId])

    return {
        chatOpened,
        chatClosed
    }
}