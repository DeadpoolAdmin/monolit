import { createSlice } from "@reduxjs/toolkit";

const sidebarShowSlice = createSlice({
    name: 'sidebarShow',
    initialState: {
        sidebarShow: true
    },
    reducers: {
        setSidebarShow: (state, action) => {
            state.sidebarShow = action.payload
        }
    }
})

export const { setSidebarShow } = sidebarShowSlice.actions
export default sidebarShowSlice.reducer