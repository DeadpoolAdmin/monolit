import { DeviceInfoApi } from "@/services/DeviceInfo/DeviceInfoApi";
import { brandingApi } from "@/services/Settings/SettingsApi";
import { configureStore } from "@reduxjs/toolkit";
import { deviceApi } from "@/services/DeviceInfo/DeviceApi";
import { mediaApi } from "@/services/Media/Backend/MediaApi";
import { brandingSlice } from "@/slices/BrandingSlice";
import { settingsSlice } from "@/slices/SettingsSlice";
import liveTvTabsSlice from "@/slices/LiveTV/liveTvTabs";
import selectedChannelSlice from "@/slices/LiveTV/selectedChannel";
import selectedCategorySlice from "@/slices/LiveTV/selectedCategory";
import sidebarShowSlice from "@/slices/LiveTV/sidebarShow";

import movieCurrentRowSlice from '@/slices/Movies/MovieCurrentRow'
import rootControlSlice from "@/slices/RootControlSlice";
import { appPlaylistApi } from "@/services/Media/Backend/AppPlaylist";

import m3u8Slice from '@/slices/Movies/M3u8Slice'

import xtreamSlice from '@/slices/Movies/XtreamSlice'
import movieDetailSlice from '@/slices/Movies/MovieDetailSlice'
import { servicesApi } from "@/services/PMS/servicesApi";

import hotelServiceSlice from '@/slices/HotelServices/HotelServiceSlice'

import basketSlice from '@/slices/HotelServices/BasketSlice'
import tabs from '@/slices/Settings/TabsSlice'
import flightTabSlice from '@/slices/Airports/flightTabSlice'

import musicSlice from '@/slices/Music/musicSlice'


import orderTabSlice from '@/slices/Orders/OrderTabSlice'

import promotionDataSlice from '@/slices/Promotion/PromotionDataSlice'

import alarmSlice from '@/slices/Alarm/alarmSlice'

import deviceInfoSlice from '@/slices/DeviceInfo'

import selectedDatesSlice from '@/slices/ReservationPopup/selected_dates'

import messagesSlice from '@/slices/Messages/MessagesSlice'
import { messagesApi } from "@/services/Meetings/Meetings";
import { mediaPlaylistApi } from "@/services/Media/PlaylistApi/PlaylistApi";
import { xtreamInfoApi } from "@/services/Media/PlaylistApi/XtreamInfoApi";
import { SignageApi } from "@/services/Signage/Signage";

import SignageSlice from '@/slices/Signage/SignageSlice'
import { notificationsApi } from "@/services/Notifications/notificationsApi";

import notificationSlice from '@/slices/Notifications/NotificationSlice'
import { RoomControlApi } from "@/services/RoomControl/RoomControlApi";

const middlewares = [
    deviceApi.middleware,
    DeviceInfoApi.middleware,
    brandingApi.middleware,
    mediaApi.middleware,
    appPlaylistApi.middleware,
    servicesApi.middleware,
    messagesApi.middleware,
    mediaPlaylistApi.middleware,
    xtreamInfoApi.middleware,
    SignageApi.middleware,
    notificationsApi.middleware,
    RoomControlApi.middleware,
]

const store = configureStore({
    reducer: {
        [deviceApi.reducerPath]: deviceApi.reducer,
        [DeviceInfoApi.reducerPath]: DeviceInfoApi.reducer,
        [brandingApi.reducerPath]: brandingApi.reducer,
        [brandingSlice.name]: brandingSlice.reducer,
        [settingsSlice.name]: settingsSlice.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [appPlaylistApi.reducerPath]: appPlaylistApi.reducer,
        [servicesApi.reducerPath]: servicesApi.reducer,
        [mediaPlaylistApi.reducerPath]: mediaPlaylistApi.reducer,
        [xtreamInfoApi.reducerPath]: xtreamInfoApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
        [SignageApi.reducerPath]: SignageApi.reducer,
        [notificationsApi.reducerPath]: notificationsApi.reducer,
        [RoomControlApi.reducerPath]: RoomControlApi.reducer,
        deviceInfo: deviceInfoSlice,
        rootControl: rootControlSlice,
        liveTvTabs: liveTvTabsSlice,
        selectedChannel: selectedChannelSlice,
        selectedCategory: selectedCategorySlice,
        sidebarShow: sidebarShowSlice,
        m3u8Slice,
        movieCurrentRowSlice,
        xtreamSlice,
        movieDetailSlice,
        hotelServiceSlice,
        basket: basketSlice,
        tabs,
        flightTab: flightTabSlice,
        music: musicSlice,
        orderTab: orderTabSlice,
        promotionData: promotionDataSlice,
        alarmSlice,
        messagesSlice,
        selectedDates: selectedDatesSlice,
        signage: SignageSlice,
        notification: notificationSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(middlewares),
})

export default store