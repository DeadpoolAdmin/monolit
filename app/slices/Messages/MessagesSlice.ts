import { IDepartmentInfo, IQuickMessage } from "@/modules/Chat/types/message.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IMessageDto {
    content : string;
    sender : string;
    _id : string;
    translatedText?: string;
    guestId?: string;
    updatedAt?: string;
    departmentUnitId?: string;
}

export interface MessagesState {
    depInfo: IDepartmentInfo | null;
    messages: IMessageDto[];
    lastReceivedMessage : {
        content : string;
        translatedText : string;
        _id : string;
        updatedAt: string;
        sender : string;
        guestId: string;
        departmentUnitId? : string
    } | null;
    isTranslated: boolean;  
    quickMessage : IQuickMessage | null;
}


const messagesSlice = createSlice({
    name : 'messages',
    initialState: {
        depInfo : null,
        messages : [],
        lastReceivedMessage: null,
        isTranslated : false,
        quickMessage : null
    } as MessagesState,
    reducers : {
        setDepInfo : (state, action) => {
            state.depInfo = action.payload;
        },
        setMessages : (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<IMessageDto>) => {
            state.messages.push(action.payload);
        },
        setLastReceivedMessage: (state, action: PayloadAction<{ content: string; translatedText: string; _id: string; updatedAt: string; sender: string; guestId: string, departmentUnitId : string }>) => {
            state.lastReceivedMessage = action.payload;
        },
        setIsTranslatedMessages : (state, action: PayloadAction<boolean>) => {
            state.isTranslated = action.payload;
        },
        addQuickMessage : (state, action) => {
            state.quickMessage = action.payload;
        },
        clearQuickMessage : (state) => {
            state.quickMessage = null;
        }
          
    }
})

export const { setDepInfo, setMessages, addMessage, setLastReceivedMessage, setIsTranslatedMessages, addQuickMessage, clearQuickMessage } = messagesSlice.actions;

export default messagesSlice.reducer;