import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dynamicBaseQuery = (args: { url: string }, api: any, extraOptions: any) => {
    const baseUrl = window.PLAYLIST_URL;

    // Ensure the baseUrl ends with '?username=41997278946&password=10101010'
    const cleanedBaseUrl = window.LIVETV_SOURCE !== 'api' && baseUrl.endsWith('&') ? baseUrl.slice(0, -1) : baseUrl;

    // Combine the baseUrl with the query parameters
    const url = `${cleanedBaseUrl}${args.url}`;

    return fetchBaseQuery({ baseUrl: '' })({ ...args, url }, api, extraOptions);
};

export const mediaPlaylistApi = createApi({
    reducerPath: 'mediaPlaylistApi',
    baseQuery: dynamicBaseQuery,
    endpoints: (builder) => ({
        getXtreamChannels: builder.query({
            query: () => ({
                url: `&action=get_live_streams`,
            }),
            keepUnusedDataFor: 0,
        }),
        getXtreamChannelsCategories: builder.query({
            query: () => ({
                url: `&action=get_live_categories`,
            }),
            keepUnusedDataFor: 0,
        }),
        getXtreamMovies: builder.query({
            query: () => ({
                url: '&action=get_vod_streams', // Start with '?'
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),
        getXtreamMovieCategories: builder.query({
            query: () => ({
                url: '&action=get_vod_categories', // Start with '?'
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),
        getXtreamSeriesCategories: builder.query({
            query: () => ({
                url: '&action=get_series_categories', // Start with '?'
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),
        getXtreamSeries: builder.query({
            query: () => ({
                url: '&action=get_series', // Start with '?'
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),
        getXtreamSeriesInfo: builder.query({
            query: (series_id) => ({
                url: `&action=get_series_info&series_id=${series_id}`, // Start with '?'
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        })
    }),
})


export const {
    useGetXtreamChannelsQuery,
    useLazyGetXtreamChannelsQuery,
    useGetXtreamChannelsCategoriesQuery,
    useLazyGetXtreamChannelsCategoriesQuery,
    useGetXtreamMovieCategoriesQuery,
    useLazyGetXtreamMovieCategoriesQuery,
    useGetXtreamMoviesQuery,
    useLazyGetXtreamMoviesQuery,
    useGetXtreamSeriesCategoriesQuery,
    useLazyGetXtreamSeriesCategoriesQuery,
    useGetXtreamSeriesQuery,
    useLazyGetXtreamSeriesQuery,
    useGetXtreamSeriesInfoQuery,
    useLazyGetXtreamSeriesInfoQuery
} = mediaPlaylistApi