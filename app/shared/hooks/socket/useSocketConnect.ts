import { useResolution } from '@hotel-smarters/resolution-hook';
import {  useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

let globalSocket: Socket | null = null;
let isConnecting = false;

const useSocketConnect = () => {
  const socketRef = useRef<Socket | null>(globalSocket);
  const listenerAttachedRef = useRef(false);
  const notifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeNotifyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const token = useMemo(() => localStorage.getItem('token') as string, []);
  const location = useLocation();

  useEffect(() => {
    const shouldConnect = location.pathname.includes('menu');
    const currentToken = localStorage.getItem('token');

    const deviceType = useResolution().getDeviceType();

    // If no token, disconnect socket if it exists
    if (!currentToken && globalSocket && deviceType !== 'SIGNAGE') {
      console.log('No token found, disconnecting socket');
      globalSocket.disconnect();
      globalSocket = null;
      socketRef.current = null;
      listenerAttachedRef.current = false;
      isConnecting = false;
      return;
    }

    // If token exists and should connect
    if (currentToken && !globalSocket && !isConnecting && shouldConnect && deviceType !== 'SIGNAGE') {
      isConnecting = true;

      const socket = io(process.env.REACT_APP_API_HOST + '/notifications', {
        transports: ['websocket'],
        path: '/notifications/socket.io',
        auth: {
          token: `Bearer ${currentToken}`,
        },
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
      });

      globalSocket = socket;
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Connected Notifications Socket:', socket.id);
        isConnecting = false;

        // ✅ Attach promotionDisplay ONCE
        if (!listenerAttachedRef.current) {
          socket.on('promotionDisplay', (data) => {
            console.log('Received promotionDisplay:', data);

            (window as any).__isPromotionActive = true;

            window.dispatchEvent(new CustomEvent('promotionControl'))
            // Dispatch DOM event
            window.dispatchEvent(new CustomEvent('showNotification', {
              detail: { data },
            }));
          });

          socket.on('orderStatusChanged', (data) => {    
            window.dispatchEvent(new CustomEvent('toastOrder', {
              detail: { data },
            }))
          })

          socket.on('orderRejected', (data) => {
            window.dispatchEvent(new CustomEvent('toastOrderRejected', {
              detail: { data },
            }))
          })

          socket.on('serviceReservationStatusChanged', (data) => {

            console.log(data, 'serviceReservationStatusChanged')

            window.dispatchEvent(new CustomEvent('toastServiceReservation', {
              detail: { data },
            }))
          })

          socket.on('serviceReservationRejected', (data) => {
            window.dispatchEvent(new CustomEvent('toastServiceRejected', {
              detail: { data },
            }))
          })

          

          listenerAttachedRef.current = true;
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket error:', error);
        isConnecting = false;
      });
    } else if (currentToken && globalSocket) {
      socketRef.current = globalSocket;
      console.log('Using existing socket:', globalSocket.id);

      if (globalSocket.connected && !listenerAttachedRef.current && deviceType !== 'SIGNAGE') {
        globalSocket.on('promotionDisplay', (data) => {
          console.log('Received promotionDisplay:', data);

          (window as any).__isPromotionActive = true;

          window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { data },
          }));
        });

        globalSocket.on('orderStatusChanged', (data) => {

          console.log(data)

          window.dispatchEvent(new CustomEvent('toastOrder', {
            detail: { data },
          }))
        })

        globalSocket.on('orderRejected', (data) => {
          window.dispatchEvent(new CustomEvent('toastOrder', {
            detail: { data },
          }))

          window.dispatchEvent(new CustomEvent('toastOrderRejected', {
            detail: { data },
          }))
        })

        globalSocket.on('serviceReservationStatusChanged', (data) => {

          console.log(data, 'serviceReservationStatusChanged')

          window.dispatchEvent(new CustomEvent('toastServiceReservation', {
            detail: { data },
          }))
        })

        globalSocket.on('serviceReservationRejected', (data) => {
          console.log('service reservation status', data)

          window.dispatchEvent(new CustomEvent('toastServiceRejected', {
            detail: { data },
          }))
        })

        globalSocket.onAny((event, data) => {
          console.log('Received event:', event, data);
        })

        listenerAttachedRef.current = true;
      }
    }
  }, [location, token]);


  useEffect(() => {
    // ✅ When you call showNotification from useEffect

    return () => {
      // ✅ Clean up
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (notifyTimeoutRef.current) clearTimeout(notifyTimeoutRef.current);
      if (closeNotifyTimeoutRef.current) clearTimeout(closeNotifyTimeoutRef.current);
    };
  }, []);

  return {
    socketRef,
    notifyTimeoutRef,
    closeNotifyTimeoutRef,
    intervalRef,
  };
};

export default useSocketConnect;
