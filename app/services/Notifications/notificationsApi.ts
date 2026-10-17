import { INotification } from "@/modules/Notifications/types/Notification.type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_HOST + '/notifications',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token') as string;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getGuestNotifications: builder.query({
            query: () => ({
                url: '/notifications/guest',
            }),
        }),

        getUnreadCount: builder.query({
            query: () => ({
                url: '/notifications/unred-count',
            }),
        }),

        markNotificationAsRead: builder.mutation({
            query: (id: string) => ({
                url: `/notifications/markAsRead/${id}`,
                method: 'PUT',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationsApi.util.updateQueryData('getGuestNotifications', undefined, (draft) => {
                        const notification = draft.notifications.find((n: INotification) => n._id === id);
                        if (notification && !notification.isRead) {
                            notification.isRead = true;
                            // Update unread count optimistically
                            if (draft.unreadCount > 0) {
                                draft.unreadCount -= 1;
                            }
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        markAllNotificationsAsRead: builder.mutation({
            query: () => ({
                url: `/notifications/markAllAsRead/guest`,
                method: 'PUT',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    notificationsApi.util.updateQueryData('getGuestNotifications', undefined, (draft) => {
                        draft.notifications.forEach((notification: INotification) => {
                            notification.isRead = true;
                        });
                        // Set unread count to 0
                        draft.unreadCount = 0;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
    }),
})

export const { useGetGuestNotificationsQuery, useLazyGetGuestNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation, useLazyGetUnreadCountQuery } = notificationsApi;