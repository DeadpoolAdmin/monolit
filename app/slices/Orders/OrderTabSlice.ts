import { createSlice } from "@reduxjs/toolkit";

const orderControlSlice = createSlice({
    name : 'orderTab',
    initialState : {
        selectedTab : 'inventories',
    },
    reducers : {
        setSelectedTab : (state, action) => {
            state.selectedTab = action.payload;
        },
    }
})


export const { setSelectedTab } = orderControlSlice.actions;
export default orderControlSlice.reducer;