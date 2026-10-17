// useSocket.ts
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage } from "@/slices/Messages/MessagesSlice";
import { useResolution } from "@hotel-smarters/resolution-hook";

let globalSocket: Socket | null = null;
let isConnecting = false;
let listenerAttached = false;

export function useChatSocket() {
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();

    const deviceType = useResolution().getDeviceType();

    // Initialize socket without connecting
    const initializeSocket = useCallback(() => {
        const token = localStorage.getItem("token");
        const apiHost = process.env.REACT_APP_API_HOST;

        // Check if API host is available
        if (!apiHost) {
            console.error('❌ REACT_APP_API_HOST environment variable is not set');
            return false;
        }

        // Check if token exists
        if (!token) {
            console.log('❌ No token found, cannot initialize chat socket');
            return false;
        }

        // Create socket if it doesn't exist
        if (!globalSocket && !isConnecting && deviceType !== 'SIGNAGE') {
            isConnecting = true;
            console.log('🔌 Creating chat socket instance for:', `${apiHost}/meetings`);

            const socket = io(`${apiHost}/meetings`, {
                path: "/meetings/socket.io",
                transports: ["websocket"],
                autoConnect: false,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                auth: {
                    token: `Bearer ${token}`,
                },
            });

            globalSocket = socket;
            socketRef.current = socket;

            // Attach listeners only once
            if (!listenerAttached) {
                socket.on("connect", () => {
                    console.log("✅ Chat socket connected:", socket.id);
                    isConnecting = false;
                });

                socket.on("disconnect", (reason) => {
                    console.log("⚠️ Chat socket disconnected:", reason);
                    isConnecting = false;
                });

                socket.on("connect_error", (err) => {
                    console.error("❌ Chat socket connection error:", err.message);
                    isConnecting = false;
                });

                // 📩 New message listener
                 socket.on("newMessage", (message) => {
                     console.log("📩 Received newMessage:", message);
                     
                     // Get current user's guestId to avoid duplicating our own sent messages
                     let currentGuestId = localStorage.getItem('guestId');

                     // Normalize the sender field - if it's an object, extract the _id
                     const normalizedSender = typeof message.sender === 'object' ? message.sender._id : message.sender;
                     const senderType = typeof message.sender === 'object' ? message.sender.type : null;

                     console.log("🔍 sender:", normalizedSender, "senderType:", senderType, "currentGuestId:", currentGuestId);

                     // If this is a guest message and we don't have a guestId yet, check if it's our optimistic message
                     if (!currentGuestId && senderType === 'guest') {
                         const lastSentMessage = localStorage.getItem('lastSentMessage');
                         
                         if (lastSentMessage) {
                             // Parse the stored message (format: "content_timestamp")
                             const [storedContent] = lastSentMessage.split('_');
                             const messageContent = message.content.trim();
                             
                             // Check if contents match (this is our first message coming back)
                             if (storedContent === messageContent) {
                                 console.log("💾 First message detected - storing guestId:", normalizedSender);
                                 localStorage.setItem('guestId', normalizedSender);
                                 currentGuestId = normalizedSender;
                                 console.log("⏭️ Skipping duplicate - already added optimistically");
                                 localStorage.removeItem('lastSentMessage');
                                 return; // Don't add the message again
                             }
                         }
                     }

                     // Check if this is our own message
                     const isOwnMessage = (senderType === 'guest' && normalizedSender === currentGuestId) ||
                                         (message.guestId && message.guestId === currentGuestId);

                     console.log("🔍 Is own message:", isOwnMessage);

                     // If it's our own message, check if we already added it optimistically
                     if (isOwnMessage) {
                         const lastSentMessage = localStorage.getItem('lastSentMessage');
                         
                         if (lastSentMessage) {
                             // Parse the stored message (format: "content_timestamp")
                             const [storedContent] = lastSentMessage.split('_');
                             const messageContent = message.content.trim();
                             
                             // Check if contents match (this is our optimistic message echo)
                             if (storedContent === messageContent) {
                                 console.log("⏭️ Skipping duplicate - already added optimistically");
                                 localStorage.removeItem('lastSentMessage');
                                 return; // Don't add the message again
                             }
                         }
                         
                         console.log("⚠️ Own message received but no optimistic match - skipping anyway");
                         return; // Skip all our own messages from server
                     }

                     // Only add messages from staff/front desk
                     console.log("✅ Adding message from staff");
                     dispatch(addMessage({
                         sender: normalizedSender,
                         translatedText: message.translatedText || "",
                         _id: message._id,
                         content: message.content,
                         guestId: message.guestId,
                         updatedAt: message.updatedAt,
                         departmentUnitId: message.departmentUnitId
                     }));

                     // Show toast notification for messages from staff/front desk
                     if (senderType && senderType !== 'guest') {
                         window.dispatchEvent(new CustomEvent('toastMessage', { detail: { message } }));
                     }
                 });

                // for debugging
                socket.onAny((event, ...args) => {
                    console.log("📡 Chat event received:", event, args);
                });

                listenerAttached = true;
            }
            
            isConnecting = false;
            return true;
        } else if (globalSocket) {
            // Use existing socket
            socketRef.current = globalSocket;
            console.log('♻️ Reusing existing chat socket');
            return true;
        }

        return false;
    }, [dispatch]);

    useEffect(() => {
        // Initialize socket on mount if token exists
        const token = localStorage.getItem("token");
        if (token) {
            initializeSocket();
        }

        // Cleanup function
        return () => {
            // Don't disconnect on unmount, keep global socket alive
        };
    }, [initializeSocket]);

    const connect = useCallback(() => {
        // Ensure socket is initialized before connecting
        if (!socketRef.current && deviceType !== 'SIGNAGE') {
            console.log('🔄 Initializing socket before connecting...');
            const initialized = initializeSocket();
            if (!initialized) {
                console.warn('⚠️ Cannot connect: Failed to initialize chat socket');
                return;
            }
        }

        if (socketRef.current) {
            if (socketRef.current.connected) {
                console.log('✅ Chat socket already connected:', socketRef.current.id);
            } else {
                console.log('🔌 Manually connecting chat socket...');
                socketRef.current.connect();
            }
        }
    }, [initializeSocket]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            if (socketRef.current.connected) {
                console.log('🔌 Manually disconnecting chat socket...');
                socketRef.current.disconnect();
            } else {
                console.log('⚠️ Chat socket already disconnected');
            }
        }
    }, []);

    return {
        socketRef,
        connect,
        disconnect
    };
}
