import { useLazyGetGuestNotificationsQuery } from '@/services/Notifications/notificationsApi'
import React, { useCallback, useEffect, useMemo } from 'react'
import QueryWrapper from '@/shared/components/QueryWrapper';
import NotificationsContent from '../components/NotificationsContent';
import { setRootControl } from '@/slices/RootControlSlice';
import { useDispatch } from 'react-redux';
import { ROOT_CONTROL } from '@/shared/types/rootcontrol/ROOT_CONTROL';
import { setUnreadCount } from '@/slices/Notifications/NotificationSlice';

const Notifications = () => {

  const dispatch = useDispatch();

  const [getGuestNotifications, { isFetching, data: guestNotificationData, isLoading }] = useLazyGetGuestNotificationsQuery();

  const onGetGuestNotifications = useCallback(async () => {
    try {
      await getGuestNotifications(undefined).unwrap();
    } catch (error) {
      console.error(error);
    }
  }, [getGuestNotifications]);

  useEffect(() => {
    onGetGuestNotifications();
  }, [onGetGuestNotifications]);

  useEffect(() => {
    dispatch(setRootControl(ROOT_CONTROL.NOTIFICATIONS));
  }, [dispatch]);

  // Check if data is undefined (not fetched yet) vs empty array (fetched but no results)
  const isEmpty = useMemo(() => 
    guestNotificationData !== undefined && guestNotificationData.notifications.length === 0,
    [guestNotificationData]
  );

  useEffect(() => {
    if(guestNotificationData) {
      dispatch(setUnreadCount(guestNotificationData.unreadCount));
    }
  }, [guestNotificationData, dispatch]);

  return (
    <QueryWrapper isLoading={isLoading || isFetching} isEmpty={isEmpty}>
      <NotificationsContent notifications={guestNotificationData?.notifications ?? []} />
    </QueryWrapper>
  )
}

export default Notifications