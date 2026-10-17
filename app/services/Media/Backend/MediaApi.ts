import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApi = createApi({
    reducerPath: 'mediaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/media',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            headers.set('Accept', 'application/json')
            headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`)
            return headers
        }
    }),
    endpoints: (builder) => ({
        getChannels: builder.query({
            query: () => ({
                url: '/channels',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getChannelUrls: builder.query<string, string>({
            query: (id : string) => ({
                url: `/channels/${id}/url`,
                method: 'GET',
                responseHandler: 'text',
            }),
            transformResponse: (response: string) => response,
            keepUnusedDataFor: 0,
        }),
        getCategories: builder.query({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getMovies: builder.query({
            query: () => ({
                url: '/movies',
            }),
            keepUnusedDataFor: 0,
        }),
        getMoviesWithGenres: builder.query({
            query: (genreIds: string[]) => ({
                url: `/movies/genres/${genreIds}`,
            }),
            keepUnusedDataFor: 0,
        }),
        mutateMovies: builder.mutation({
            query: () => ({
                url: `/movies`,
            }),
        }),
        getSeries: builder.query({
            query: () => ({
                url: '/series',
            }),
            keepUnusedDataFor: 0,
        }),
        getSeriesInfo: builder.query({
            query: (seriesId: string) => ({
                url: `/series/info${seriesId}`,
            }),
            keepUnusedDataFor: 0,
        }),
        getGenres: builder.query({
            query: () => ({
                url: '/genres',
            }),
            keepUnusedDataFor: 0,
        }),
        getM3Movies: builder.query({
            query: () => ({
                url: `/playlists/movies?playlistId=${localStorage.getItem('playlistId') as string}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),

        getM3Series: builder.query({
            query: () => ({
                url: `/playlists/series?playlistId=${localStorage.getItem('playlistId') as string}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0, // Cache for 15 minutes
        }),
        getMusics: builder.query({
            query: (genreId: string) => ({
                url: `/music/genres/${genreId}`,
                params: {
                    genreId
                }

            }),
            keepUnusedDataFor: 0,
        }),
        getRadio: builder.query({
            query: (genreId: string) => ({
                url: `/radios/genres/${genreId}`,
            }),
            keepUnusedDataFor: 0,
        }),
        

    }),
})

export const {
    useGetChannelsQuery,
    useLazyGetChannelsQuery,
    useGetCategoriesQuery,
    useLazyGetCategoriesQuery,
    useGetMoviesQuery,
    useLazyGetMoviesQuery,
    useGetMoviesWithGenresQuery,
    useLazyGetMoviesWithGenresQuery,
    useMutateMoviesMutation,
    useGetSeriesQuery,
    useLazyGetSeriesQuery,
    useGetSeriesInfoQuery,
    useLazyGetSeriesInfoQuery,
    useGetGenresQuery,
    useLazyGetGenresQuery,
    useGetM3MoviesQuery,
    useLazyGetM3MoviesQuery,
    useGetM3SeriesQuery,
    useLazyGetM3SeriesQuery,
    useGetMusicsQuery,
    useLazyGetMusicsQuery,
    useGetRadioQuery,
    useLazyGetRadioQuery,
    useLazyGetChannelUrlsQuery
} = mediaApi


