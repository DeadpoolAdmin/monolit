import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const appPlaylistApi = createApi({
    reducerPath: 'appPlaylistApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/media',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAppPlaylist: builder.query({
            query: () => ({
                url: `playlists`
            }),
        }),
        getPlaylistByDeviceId: builder.mutation({
            query:(deviceId) => {
                if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
                    throw new Error('Invalid deviceId provided');
                }
                return {
                    url: `/playlists/byDeviceId/${deviceId}`
                };
            }
        }),
        playlistParse : builder.mutation({
            query: (playlistId) => ({
                url : '/playlists/parse',
                params:  playlistId,
                method: 'POST',
            })
        }),
        uploadPlaylist : builder.mutation({
            query: ({playlistId, file} : { playlistId : string, file : FormData }) => ({
                url: '/playlists/upload',
                method: 'POST',
                params: {
                    playlistId
                },
                body : file
    
            })
        })
    }),
})


export const { useGetAppPlaylistQuery, usePlaylistParseMutation, useGetPlaylistByDeviceIdMutation, useUploadPlaylistMutation } = appPlaylistApi