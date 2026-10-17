import { TABS_FLIGHT } from "@/modules/Airport/types/tabs.flight.interface";
import { createSlice } from "@reduxjs/toolkit";


const flightTabSlice = createSlice({
    name: "flightTabs",
    initialState: {
        activeTab: TABS_FLIGHT.ARRIVALS,
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
    },
})

export const { setActiveTab } = flightTabSlice.actions;
export default flightTabSlice.reducer;