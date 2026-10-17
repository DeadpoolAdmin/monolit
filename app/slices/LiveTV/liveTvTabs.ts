import { TABS } from "@/modules/LiveTV/types/livetv.tabs";
import { createSlice } from "@reduxjs/toolkit";

const tabsSlice = createSlice({
    name: 'liveTvTabs',
    initialState: {
        selectedTab: TABS.CHANNELS
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.selectedTab = action.payload
        }
    }
})


export const { setActiveTab } = tabsSlice.actions
export default tabsSlice.reducer