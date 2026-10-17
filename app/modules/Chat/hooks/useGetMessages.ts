
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { IMessage } from "../types/message.interface";
import { useDispatch } from "react-redux";
import { setDepInfo, setMessages } from "@/slices/Messages/MessagesSlice";
import { useLazyGetMessagesQuery } from "@/services/Meetings/Meetings";

export const useGetMessages = () => {
    const [getMessages, { isLoading }] = useLazyGetMessagesQuery();
    const [msgs, setMsgs] = useState<IMessage[]>([]);
    const [deparmentInfo, setDepartmentInfo] = useState<IMessage | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);
    
    const dispatch = useDispatch();
    const location = useLocation();
    
    const departmentId = useMemo(() => 
        new URLSearchParams(location.search).get('departmentId'), 
        [location.search]
    );

    const clearState = useCallback(() => {
        setMsgs([]);
        setDepartmentInfo(null);
        setGuestId(null);
        dispatch(setMessages([]));
        dispatch(setDepInfo(''));
    }, [dispatch]);

    const fetchMessages = useCallback(async (id: string) => {
        clearState();

        
        try {   
            const response = await getMessages(id).unwrap();
            
            if (!response?.length) {
                // If no response or empty response, state is already cleared
                return;
            }
            
            const res = response[0];

            if (res.departmentUnitId) {
                setDepartmentInfo(res.depInfo);
            }

            const messages = res.messages.map((message: IMessage) => ({
                ...message,
                departmentUnitId: res.departmentUnitId,
                guestId: res.guest._id
            }));


            setMsgs(res.messages);
            setGuestId(res.guest._id);
            dispatch(setMessages(messages));
            dispatch(setDepInfo(res.departmentUnitId));
        }
        catch(err) {
            console.error("Error fetching messages:", err);
        }
    }, [getMessages, dispatch, clearState]);

    useEffect(() => {
        if (departmentId) {
            fetchMessages(departmentId);
        } else {
            clearState();
        }
    }, [departmentId, fetchMessages, clearState]);

    return { msgs, deparmentInfo, guestId, isLoading };
}