import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: 'settingsData',
    initialState: {
        settingsData: null,
        isGuestAlive: true,
        isGuestLoaded: false
    },
    reducers: {
        setSettingsData: (state, action) => {
            state.settingsData = action.payload
        },
        setIsGuestAlive: (state, action) => {
            state.isGuestAlive = action.payload
        },
        setIsGuestLoaded: (state, action) => {
            state.isGuestLoaded = action.payload
        }
    }
})

export const { setSettingsData, setIsGuestAlive, setIsGuestLoaded } = settingsSlice.actions
export default settingsSlice.reducer