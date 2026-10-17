import { createSlice } from "@reduxjs/toolkit";

const hotelServiceSlice = createSlice({
    name: 'hotelService',
    initialState: {
        showToast: false,
        openWarehouse: true,
        servicePreviousControl: null
    },
    reducers: {
        setShowToast: (state, action) => {
            state.showToast = action.payload
        },
        setOpenWarehouse: (state, action) => {
            state.openWarehouse = action.payload
        },
        setServicePreviousControl: (state, action) => {
            state.servicePreviousControl = action.payload
        }
    }
})

export const { setShowToast, setOpenWarehouse, setServicePreviousControl } = hotelServiceSlice.actions

export default hotelServiceSlice.reducer