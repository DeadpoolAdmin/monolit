import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

// Dynamic base query that reads from localStorage on each request
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
    try {
        let baseUrl = localStorage.getItem('roomControlUrl');
        if (!baseUrl) {
            // If no baseUrl, return a rejected error, following RTK Query error format
            throw new Error('Room Control baseUrl not configured.');
        }

        // Ensure baseUrl has protocol (http:// or https://)
        // This prevents the dev server from treating it as a relative URL
        if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
            baseUrl = `http://${baseUrl}`;
            // Optionally update localStorage with the corrected URL
            localStorage.setItem('roomControlUrl', baseUrl);
        }

        const rawBaseQuery = fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
                const token = localStorage.getItem('token');
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                return headers;
            }
        });

        return await rawBaseQuery(args, api, extraOptions);
    } catch (error) {
        // Log error for debugging
        console.error('RoomControlApi dynamicBaseQuery error:', error);
        return {
            error: {
                status: 'CUSTOM_ERROR' as const,
                data: { message: 'An error occurred in RoomControlApi dynamicBaseQuery.' }
            }
        };
    }
};

export const RoomControlApi = createApi({
    reducerPath: 'RoomControlApi',
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        getRoomControlSettings: builder.query({
            query: () => ({
                url: '/room-config/device-room',
            }),
            keepUnusedDataFor: 0,
        }),
        getAllStatuses: builder.query({
            query: () => ({
                url: '/status',
            }),
            keepUnusedDataFor: 0,
        }),
        setActionStatus: builder.mutation({
            query: ({action, value} : {action: string, value: boolean | number}) => ({
                url: `/status/${action}`,
                method: 'POST',
                body: { value },
            }),
        }),
    }),
})

export const { useSetActionStatusMutation, useGetRoomControlSettingsQuery, useLazyGetRoomControlSettingsQuery, useGetAllStatusesQuery, useLazyGetAllStatusesQuery } = RoomControlApi;