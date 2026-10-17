import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const servicesApi = createApi({
    reducerPath: 'servicesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/pms',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getWarehouses: builder.query({
            query: ({ types }) => ({
                url: 'departmentUnits/byTypes',
                method: 'GET',
                params: types.map((t: string) => ['type', t] as const),
            }),
            keepUnusedDataFor: 0,
        }),
        getInventoryCategories: builder.query({
            query: () => ({
                url: '/inventory-categories',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
            keepUnusedDataFor: 0,
        }),
        getInventory: builder.query({
            query: (id) => ({
                url: `/inventory-categories/${id}`,
            }),
            keepUnusedDataFor: 0,
        }),
        getHotelServices: builder.query({
            query: () => ({
                url: '/services',
            }),
            keepUnusedDataFor: 0,
        }),
        getHotelService: builder.query({
            query: (id) => ({
                url: `/services/${id}`,
            }),
            keepUnusedDataFor: 0,
        }),

        getInventoryItem: builder.query({
            query: (id) => ({
                url: `/inventory/${id}`,
            }),
            keepUnusedDataFor: 0,
        }),

        addOrders: builder.mutation({
            query: (data) => ({
                url: '/orders/device',
                method: 'POST',
                body: data,
            })
        }),
        addReservations: builder.mutation({
            query: (data) => ({
                url: '/services/reservations/device',
                method: 'POST',
                body: data
            })
        }),
        getOrders: builder.query({
            query: () => ({
                url: '/orders/device',
                method: 'GET'
            }),
            keepUnusedDataFor: 0,
            transformResponse: (response: any) => {
                try {
                    return response || [];
                } catch (error) {
                    console.error('Error transforming orders response:', error);
                    return [];
                }
            },
        }),
        getOrderById: builder.query({
            query: (id: string) => ({
                url: `/orders/${id}`,
                method: 'GET'
            }),
            keepUnusedDataFor: 0,
        }),
        getReservations: builder.query({
            query: () => ({
                url: '/services/reservations/device',
            }),
            keepUnusedDataFor: 0,
        }),
        getReservationById: builder.query({
            query: (id: string) => ({
                url: `/services/reservations/${id}`,
                method: 'GET'
            }),
            keepUnusedDataFor: 0,
        }),
        cancelOrder: builder.mutation({
            query: (id: string) => ({
                url: `/orders/cancel/${id}`,
                method: 'PUT'
            }),
        }),
        cancelReservation: builder.mutation({
            query: (id: string) => ({
                url: `/services/reservations/cancel/${id}`,
                method: 'PUT'
            }),
        })
    })
})


export const {
    useGetInventoryCategoriesQuery,
    useLazyGetInventoryCategoriesQuery,
    useGetInventoryQuery,
    useLazyGetInventoryQuery,
    useGetHotelServicesQuery,
    useLazyGetHotelServicesQuery,
    useGetHotelServiceQuery,
    useLazyGetHotelServiceQuery,
    useGetWarehousesQuery,
    useLazyGetWarehousesQuery,
    useAddOrdersMutation,
    useAddReservationsMutation,
    useGetInventoryItemQuery,
    useLazyGetInventoryItemQuery,
    useGetOrdersQuery,
    useLazyGetOrdersQuery,
    useGetReservationsQuery,
    useLazyGetReservationsQuery,
    useCancelOrderMutation,
    useCancelReservationMutation,
    useLazyGetOrderByIdQuery,
    useLazyGetReservationByIdQuery,
} = servicesApi