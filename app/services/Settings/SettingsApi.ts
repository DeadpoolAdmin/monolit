import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const brandingApi = createApi({
    reducerPath: 'brandingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/settings',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') as string
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getBranding: builder.query({
            query: () => ({
                url: '/branding'
            }),
            keepUnusedDataFor: 0,
        }),
        getLanguages: builder.query({
            query: () => ({
                url: '/languages/enabled'
            }),
            keepUnusedDataFor: 0,
        }),
        getSettings: builder.query({
            query: () => '/settings',
            keepUnusedDataFor: 0,
        }),
        getGestDetails: builder.query({
            query: () => ({ url: `/rooms/guestDetails`, method: 'GET' }),
            keepUnusedDataFor: 0,
        }),
        changeViewCount: builder.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/promotions/${id}/view`,
                method: 'PUT',
            })
        }),
        changeClickCount: builder.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/promotions/${id}/click`,
                method: 'PUT',
            })
        }),
        getWeather: builder.query({
            query: (city : string) => ({
                url: '/weather/liveData',
                params: {
                    city,
                },
                method: 'GET'
            })
        }),
        getWeatherForThreeDays: builder.query({
            query: (city : string) => ({
                url: '/weather/forThreeDays',
                params: {
                    city,
                },
                method: 'GET'
            })
        }),
        getInfoCategories : builder.query({
            query : () => ({
                url : '/information-categories',
                method: 'GET'
            })
        }),

        getInfoCategory : builder.query({
            query : (id : string) => ({
                url : `/information-categories/${id}`,
                method: 'GET'
            })
        }),

        getInformation : builder.query({
            query : (id : string) => ({
                url : `/information/category${id}`,
                method: 'GET',
            })
        }),
        changeRedemptionCount: builder.mutation<void, string>({
            query: (id) => ({
                url: `/promotions/${id}/redemption`,
                method: 'PUT',
            }),
        }),
        getApplications: builder.query({
            query: () => '/applications?query[limit]=10000',
            keepUnusedDataFor: 0,
        }),
        getAirports: builder.query({
            query: ({country, city}) => ({
                url: `/airports/getAirports`,
                params: {
                    country,
                    city
                }
            }),
        }),
        getFlights: builder.query({
            query: (airportCode: string) => ({
                url: `/airports/getFlights`,
                params: {
                    airportCode,
                }
            }),
        }),
        getOrganizationByToken: builder.query({
            query: () => ({
                url: `/organizations/by-token`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        })
    }),
})


export const { 
    useGetBrandingQuery, 
    useLazyGetBrandingQuery,
    useGetLanguagesQuery, 
    useLazyGetLanguagesQuery,
    useGetSettingsQuery, 
    useLazyGetSettingsQuery,
    useGetGestDetailsQuery, 
    useLazyGetGestDetailsQuery,
    useChangeViewCountMutation, 
    useChangeClickCountMutation, 
    useGetWeatherQuery, 
    useLazyGetWeatherQuery,
    useGetWeatherForThreeDaysQuery, 
    useLazyGetWeatherForThreeDaysQuery,
    useGetInfoCategoriesQuery, 
    useLazyGetInfoCategoriesQuery,
    useGetInfoCategoryQuery, 
    useLazyGetInfoCategoryQuery,
    useGetInformationQuery, 
    useLazyGetInformationQuery,
    useChangeRedemptionCountMutation, 
    useGetApplicationsQuery, 
    useLazyGetApplicationsQuery,
    useGetAirportsQuery, 
    useLazyGetAirportsQuery,
    useGetFlightsQuery, 
    useLazyGetFlightsQuery,
    useGetOrganizationByTokenQuery, 
    useLazyGetOrganizationByTokenQuery 
} = brandingApi;