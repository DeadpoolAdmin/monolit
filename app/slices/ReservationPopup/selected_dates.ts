import { createSlice } from "@reduxjs/toolkit";

export interface SelectedDateData {
    date: string;
    time: string;
    fullIdentifier: string; // date|time format for unique identification
}

export const selectedDatesSlice = createSlice({
    name: 'selectedDates',
    initialState: {
        selectedDates: null as SelectedDateData | null
    },
    reducers: {
        setSelectedDates: (state, action) => {
            state.selectedDates = action.payload;
        },
    },
});

export const { setSelectedDates } = selectedDatesSlice.actions;
export default selectedDatesSlice.reducer;