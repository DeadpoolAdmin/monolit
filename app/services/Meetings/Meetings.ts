import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/meetings',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') as string;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (departmentId: string) => ({
                url: `/chatSessions/byDepartmentUnit/${departmentId}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getFrontDeskMessages: builder.query({
            query: () => ({
                url: '/chatSessions/guest',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getQuickMessages: builder.query({
            query: () => ({
                url: 'messages/quick/guest',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        })
    })
})

export const { 
    useGetMessagesQuery, 
    useLazyGetMessagesQuery,
    useGetFrontDeskMessagesQuery, 
    useLazyGetFrontDeskMessagesQuery,
    useGetQuickMessagesQuery, 
    useLazyGetQuickMessagesQuery 
} = messagesApi;