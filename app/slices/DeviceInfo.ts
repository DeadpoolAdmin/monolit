import { DeviceInfo } from '@/shared/types/DeviceInfo';
import { createSlice } from '@reduxjs/toolkit';

export interface DeviceInfoState {
    isFetched: boolean;
    deviceInfo: DeviceInfo | null;
    device: DeviceInfo | null;
}

const initialState: DeviceInfoState = {
    deviceInfo: null,
    isFetched: false,
    device: null,
};

const deviceInfoSlice = createSlice({
    name: 'deviceInfo',
    initialState,
    reducers: {
        setDeviceInfoFetched: (state) => {
            state.isFetched = true;
        },
        resetDeviceInfoFetched: (state) => {
            state.isFetched = false;
        },
        setDeviceInfo : (state, action) => {
            state.deviceInfo = action.payload;
        },
        setDevice : (state, action) => {
            state.device = action.payload;
        }
    },
});

export const { setDeviceInfoFetched, resetDeviceInfoFetched, setDeviceInfo, setDevice } = deviceInfoSlice.actions;
export default deviceInfoSlice.reducer;