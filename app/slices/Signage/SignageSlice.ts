import { createSlice } from "@reduxjs/toolkit";

const SignageSlice = createSlice({
    name: 'signage',
    initialState: {
        screens: [],
        isSignageCalled: false
    },
    reducers: {
        setScreens: (state, action) => {
            state.screens = action.payload;
        },
        setIsSignageCalled: (state, action) => {
            state.isSignageCalled = action.payload;
        },
    },
})

export const { setScreens, setIsSignageCalled } = SignageSlice.actions;

export default SignageSlice.reducer;