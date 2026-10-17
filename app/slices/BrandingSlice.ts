import { createSlice } from "@reduxjs/toolkit";

export const brandingSlice = createSlice({
    name: 'branding',
    initialState: {
        branding: null,
    },
    reducers: {
        setBranding: (state, action) => {
            state.branding = action.payload;
        }
    },

})

export const { setBranding } = brandingSlice.actions;
export default brandingSlice.reducer;