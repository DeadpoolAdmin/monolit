import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { createSlice } from "@reduxjs/toolkit";

const rootControlSlice = createSlice({
    name: 'rootControl',
    initialState: {
        rootControl: ROOT_CONTROL || null,
        prevRootControl: ROOT_CONTROL || null,
    },
    reducers: {
        setRootControl: (state, action) => {
            state.rootControl = action.payload;
        },
        setPrevRootControl: (state, action) => {
            state.prevRootControl = action.payload;
        }
    }
})

export const { setRootControl, setPrevRootControl } = rootControlSlice.actions

export default rootControlSlice.reducer