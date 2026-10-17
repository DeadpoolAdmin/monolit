import { INotification } from "@/modules/Notifications/types/Notification.type";
import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notification: null as INotification | null,
        unreadCount: 0,
        fromToast: false
    },
    reducers: {
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        setFromToast: (state, action) => {
            state.fromToast = action.payload;
        }
    },
})

export const { setNotification, setUnreadCount, setFromToast } = notificationSlice.actions;

export default notificationSlice.reducer;