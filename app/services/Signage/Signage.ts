import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const SignageApi = createApi({
    reducerPath: 'SignageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/signage',
        prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
            return headers
        }
    }),
    endpoints: (builder) => ({
        getSignageScreen: builder.query({
            query: () => ({
                url: '/screens',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getActiveSignageScreen: builder.query({
            query: () => ({
                url: '/devices/screen',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
    }),
})

export const { 
    useGetSignageScreenQuery, 
    useLazyGetSignageScreenQuery,
    useGetActiveSignageScreenQuery, 
    useLazyGetActiveSignageScreenQuery 
} = SignageApi;
