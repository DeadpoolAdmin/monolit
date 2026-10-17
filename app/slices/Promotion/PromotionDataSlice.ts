import { createSlice } from "@reduxjs/toolkit";

const promotionDataSlice = createSlice({
    name: "promotionData",
    initialState: {
        data: null,
    },
    reducers: {
        setPromotionData(state, action) {
            state.data = action.payload;
        },
        clearPromotionData(state) {
            state.data = null;
        },
    },
})

export const { setPromotionData, clearPromotionData } = promotionDataSlice.actions;
export default promotionDataSlice.reducer;