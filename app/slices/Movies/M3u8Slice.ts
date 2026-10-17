import { createSlice } from "@reduxjs/toolkit";

const m3u8Slice = createSlice({
    name : 'm3u8',
    initialState : {
        m3u8_data : null,
        m3u8_combined : null,
    },
    reducers : {
        setM3u8Movies : (state, action) => {
            state.m3u8_data = action.payload
        },
        setM3u8Combined : (state, action) => {
            state.m3u8_combined = action.payload
        },
    }
})

export const { setM3u8Movies, setM3u8Combined } = m3u8Slice.actions;
export default m3u8Slice.reducer;