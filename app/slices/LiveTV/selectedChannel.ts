import { IChannels, IChannelsApi, IXtreamChannels } from "@/modules/LiveTV/types/channels.interface";
import { createSlice } from "@reduxjs/toolkit";


const selectedChannelSlice = createSlice({
    name: 'selectedChannel',
    initialState: {
        selectedChannel: null as IChannels | IXtreamChannels | IChannelsApi | null
    },
    reducers: {
        setSelectedChannel: (state, action) => {
            state.selectedChannel = action.payload
        }
    }
})


export const { setSelectedChannel } = selectedChannelSlice.actions

export default selectedChannelSlice.reducer