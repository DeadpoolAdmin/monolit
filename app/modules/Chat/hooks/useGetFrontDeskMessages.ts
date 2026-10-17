import { useLazyGetFrontDeskMessagesQuery } from "@/services/Meetings/Meetings";
import { useCallback, useEffect } from "react";
import { IMessage } from "../types/message.interface";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setMessages } from "@/slices/Messages/MessagesSlice";

export const useGetFrontDeskMessages = () => {
    const [getFrontDeskMessagesMutation, { data, error, isLoading }] = useLazyGetFrontDeskMessagesQuery();

    const dispatch = useDispatch();

    const frontDeskMessages = useSelector((state : any) => state.messagesSlice.messages);

    const processFrontDeskMessages = useCallback(() => {
        if (data && data.length) {
            const messages = data[0]


            const messageArr = messages.messages.map((message: IMessage) => {
                return {
                    sender: message.sender,
                    translatedText: message.translatedText,
                    _id: message._id,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    departmentUnitId: data[0].departmentUnitId,
                    session: message.session,
                    guestId: messages.guest._id
                }
            })

            localStorage.setItem('guestId', messages.guest._id);

            dispatch(setMessages(messageArr));

        }
    }, [data, dispatch]);

    const getFrontDeskMessages = useCallback(() => {
        getFrontDeskMessagesMutation();
    }, [getFrontDeskMessagesMutation]);

    useEffect(() => {
        getFrontDeskMessages();
    }, [getFrontDeskMessages]);

    useEffect(() => {
        processFrontDeskMessages();
    }, [data, processFrontDeskMessages]);


    return {
        frontDeskMessages,
        isLoading,
        error: error,
        getFrontDeskMessages
    }
};
