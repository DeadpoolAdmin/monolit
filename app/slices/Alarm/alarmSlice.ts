import { createSlice } from "@reduxjs/toolkit";

const alarmSlice = createSlice({
    name : 'alarm',
    initialState : {
        selectedSound : null,
        selected : null,
        date : [new Date().getDate(), new Date().getHours(), new Date().getMinutes()] as [number, number, number],
        alarmTimes : [] as string[]
    },
    reducers : {
        setSelectedSound : (state, action) => {
            state.selectedSound = action.payload
        },
        setSelected : (state, action) => {
            state.selected = action.payload
        },
        setInitialDate : (state, action) => {
            state.date = action.payload;
        },
        setAlarmTimes : (state, action) => {
            state.alarmTimes = action.payload;
        },
    }
})

export const { setSelectedSound, setSelected, setInitialDate } = alarmSlice.actions;
export default alarmSlice.reducer;