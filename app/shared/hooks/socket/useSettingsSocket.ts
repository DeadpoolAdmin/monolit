import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { reloadApp } from '@/shared/hooks/useReload';
import { useResolution } from '@hotel-smarters/resolution-hook';

let globalSocket: Socket | null = null;
let isConnecting = false;

const useSettingsSocket = () => {
  const socketRef = useRef<Socket | null>(globalSocket);
  const listenerAttachedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const token = useMemo(() => localStorage.getItem('token') as string, []);
  const location = useLocation();

  const { getDeviceType } = useResolution();

  const deviceType = getDeviceType();

  useEffect(() => {
    const currentToken = localStorage.getItem('token');

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
    if (currentToken && !globalSocket && !isConnecting && deviceType !== 'SIGNAGE') {
      isConnecting = true;

      const socket = io(process.env.REACT_APP_API_HOST + '/settings', {
        transports: ['websocket'],
        path: '/settings/socket.io',
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
        console.log('Connected:', socket.id);
        isConnecting = false;

        if (!listenerAttachedRef.current) {
          socket.on('checkIn', (data) => {
            console.log('Received data:', data);

            reloadApp()
          });

          socket.on('device_revoke', (data) => {
            localStorage.clear();

            console.log('Received device_revoke:', data);

            if (globalSocket) {
              globalSocket.disconnect();
              globalSocket = null;
              socketRef.current = null;
              listenerAttachedRef.current = false;
              isConnecting = false;
            }

            reloadApp();
          });

          socket.on('device_reload', (data) => {
            console.log('Received device_reload:', data);

            reloadApp();
          });

          listenerAttachedRef.current = true;
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
        isConnecting = false;
        listenerAttachedRef.current = false;

        // Only reconnect if token still exists
        const tokenStillExists = localStorage.getItem('token');
        if (tokenStillExists) {
          socket.connect(); // Reconnect
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket error:', error);
        isConnecting = false;
      });
    } else if (currentToken && globalSocket) {
      socketRef.current = globalSocket;
      console.log('Using existing socket:', globalSocket.id);

      if (globalSocket.connected && !listenerAttachedRef.current) {
        globalSocket.on('checkIn', (data) => {
          console.log('Received checkin:', data);

          reloadApp();
        });

        globalSocket.on('device_revoke', (data) => {


          console.log('Received device_revoke:', data);

          localStorage.clear();

          if (globalSocket) {
            globalSocket.disconnect();
            globalSocket = null;
            socketRef.current = null;
            listenerAttachedRef.current = false;
            isConnecting = false;
          }

          reloadApp();

        });

        globalSocket.on('device_reload', (data) => {
          console.log('Received device_reload:', data);

          reloadApp();

        });

        listenerAttachedRef.current = true;
      }
    }
  }, [location, token, deviceType]);

  return {
    socketRef,
    intervalRef,
  };
};

export default useSettingsSocket;
