import { useChatSocket } from "@/shared/hooks/socket/useChatSocket";
import { addMessage, clearQuickMessage } from "@/slices/Messages/MessagesSlice";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

interface SendMessageDto {
    content: string;
    token: string;
    departmentUnitId: string;
}

interface UseSendMessageProps {
    externalMessage?: string;
    setExternalMessage?: (message: string) => void;
}

export const useSendMessage = ({ externalMessage, setExternalMessage }: UseSendMessageProps = {}) => {
    const { socketRef } = useChatSocket();
    const location = useLocation();

    const token = useMemo(() => localStorage.getItem('token') as string, []);

    const quickMessage = useSelector((state : any) => state.messagesSlice?.quickMessage);

    const departmentId = useMemo(
        () => new URLSearchParams(location.search).get("departmentId"),
        [location.search]
    );

    // Use external message state if provided, otherwise use internal state
    const [internalMessage, setInternalMessage] = useState(quickMessage ? quickMessage.message : "");
    const message = externalMessage !== undefined ? externalMessage : internalMessage;
    const setMessage = setExternalMessage || setInternalMessage;

    useEffect(() => {
        const quickMsg = quickMessage ? quickMessage.message : "";
        setMessage(quickMsg);
    }, [quickMessage, setMessage])

    const dispatch = useDispatch();

    const sendMessage = useCallback(() => {
        if (!message.trim()) return;

        // Check if token exists
        if (!token) {
            console.error('❌ Cannot send message: No authentication token available');
            console.error('Please ensure the chat is loaded with a valid token parameter in the URL');
            return;
        }

        // Check if socket is connected
        if (!socketRef || !socketRef.current?.connected) {
            console.error('❌ Cannot send message: Socket not connected');
            return;
        }

        // Get current guestId for optimistic update
        const currentGuestId = localStorage.getItem('guestId') || '';
        
        // Create optimistic message with temporary ID
        const tempMessage = {
            content: message,
            _id: `temp_${Date.now()}_${Math.random()}`,
            sender: currentGuestId,
            guestId: currentGuestId,
            updatedAt: new Date().toISOString(),
            translatedText: "",
            departmentUnitId: departmentId || '',
            isOptimistic: true // Mark as optimistic for tracking
        };

        console.log("📤 Sending message optimistically:", tempMessage);

        // Add message locally immediately (optimistic update)
        dispatch(addMessage(tempMessage));

        // Store the message content and timestamp to detect server echo
        const sentMessageKey = `${message.trim()}_${Date.now()}`;
        localStorage.setItem('lastSentMessage', sentMessageKey);

        // Send message to server
        socketRef.current?.emit("sendMessage", {
            content: message,
            token: `Bearer ${token}`,
            departmentUnitId: departmentId,
        } as SendMessageDto);

        setMessage("");

        dispatch(clearQuickMessage());

    }, [departmentId, token, message, socketRef, dispatch]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }, []);


    return useMemo(() => ({
        message,
        sendMessage,
        handleInputChange,
        socketRef
    }), [message, sendMessage, handleInputChange, socketRef]);
};
