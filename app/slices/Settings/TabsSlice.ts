import { TABS } from "@/modules/Settings/types";
import { createSlice } from "@reduxjs/toolkit";


const tabsSlice = createSlice({
    name: 'tabs',
    initialState: {
        activeTab: TABS.LANGUAGE,
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        }
    }
});

export const { setActiveTab } = tabsSlice.actions;
export default tabsSlice.reducer;