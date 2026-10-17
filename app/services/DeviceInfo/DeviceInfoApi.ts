import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const DeviceInfoApi = createApi({
    reducerPath: 'deviceInfoApi',
    baseQuery: fetchBaseQuery({
        baseUrl : process.env.REACT_APP_API_HOST + '/pms'
    }),
    endpoints: (builder) => ({
        getDeviceInfo : builder.mutation({
            query : () => ({
                url : '/devices/info',
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem('token')}`
                }
            })
        })
    })
})

export const { useGetDeviceInfoMutation } = DeviceInfoApi