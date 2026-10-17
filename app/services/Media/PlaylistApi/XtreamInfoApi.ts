import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const dynamicBaseQuery = (args: any, api: any, extraOptions: any) => {
    const baseUrl = (window as any).PLAYLIST_URL || '';

    const cleanedBaseUrl = baseUrl.toString().endsWith('&') ? baseUrl.toString().slice(0, -1) : baseUrl.toString();

    const url = `${cleanedBaseUrl}${args.url}`;

    return fetchBaseQuery({ baseUrl: '' })({ ...args, url }, api, extraOptions);
};



export const xtreamInfoApi = createApi({
    reducerPath : 'xtreamInfoApi',
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        getXtreamInfo: builder.query({
            query: () => ({
                url: ''
            }),
        }),
    }),
})


export const { useGetXtreamInfoQuery } = xtreamInfoApi;