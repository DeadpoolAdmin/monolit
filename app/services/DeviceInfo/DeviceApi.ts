import { DeviceInfo } from "@/shared/types/DeviceInfo";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deviceApi = createApi({
    reducerPath: 'deviceApi',
    baseQuery: fetchBaseQuery({
        baseUrl : process.env.REACT_APP_API_HOST
    }),
    endpoints: (builder) => ({
        getDevice : builder.mutation({
            query : (device_id : string) => ({
                url : `/auth/device/login`,
                method: 'POST',
                body: {
                    deviceId : device_id
                }
            })
        }),
        registerDevice : builder.mutation({
            query : ( { deviceInfo, type} : { deviceInfo : DeviceInfo, type : string }) => ({
                url : '/pms/devices/register/self',
                method: 'POST',
                body: {
                    ...deviceInfo,
                    type
                }
            })
        })
    })
})

export const { useGetDeviceMutation, useRegisterDeviceMutation } = deviceApi