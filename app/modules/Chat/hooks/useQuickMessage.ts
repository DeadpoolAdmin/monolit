import { useCallback, useEffect, useState, useRef } from "react";
import { IQuickMessage } from "../types/message.interface";
import { useDispatch } from "react-redux";
import { addQuickMessage, clearQuickMessage } from "@/slices/Messages/MessagesSlice";
import { useLazyGetQuickMessagesQuery } from "@/services/Meetings/Meetings";

// Global state to prevent multiple API calls
let globalQuickMessages: IQuickMessage[] | null = null;
let isFetching = false;

export const useQuickMessage = () => {
    const [getQuickMessages, { data: quickMessages }] = useLazyGetQuickMessagesQuery();

    const [quicks, setQuicks] = useState<IQuickMessage[]>(globalQuickMessages || []);
    const hasFetchedRef = useRef(false);

    const dispatch = useDispatch();

    const handleQuickMessages = useCallback(() => {
        if (quickMessages) {
            const quickMessageRows = quickMessages.map((message: IQuickMessage) => ({
                _id: message._id,
                message: message.message,
            }));

            globalQuickMessages = quickMessageRows;
            setQuicks(quickMessageRows);
            isFetching = false;
        }
    }, [quickMessages]);

    const chooseQuickMessage = useCallback((message: IQuickMessage) => {
        dispatch(addQuickMessage(message));
    }, [dispatch])

    const clearSelectedMessage = useCallback(() => {
        dispatch(clearQuickMessage())
    }, [])

    useEffect(() => {
        // Only fetch if we haven't fetched before and aren't currently fetching
        if (!hasFetchedRef.current && !isFetching && !globalQuickMessages) {
            hasFetchedRef.current = true;
            isFetching = true;

            getQuickMessages();
        }
    }, [getQuickMessages]);

    useEffect(() => {
        if (quickMessages) {
            handleQuickMessages();
        }
    }, [quickMessages, handleQuickMessages]);


    return {
        quicks,
        chooseQuickMessage,
        clearSelectedMessage
    }
}