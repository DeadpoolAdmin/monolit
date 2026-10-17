import { useGetPlaylistByDeviceIdMutation } from "@/services/Media/Backend/AppPlaylist";
import { IPlaylist } from "@/shared/types/playlist/playlist.interface";
import { useCallback, useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const useGetPlaylistByDevice = () => {
    const [getPlaylistByDevice] = useGetPlaylistByDeviceIdMutation();
    const [playlist, setPlaylist] = useState<IPlaylist[] | null>(null)

    const [playlistLoading, setPlaylistLoading] = useState<boolean>(true)

   const deviceInfo = useSelector((state: any) => state.deviceInfo?.deviceInfo)
    // Update deviceInfo when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            // setDeviceInfo(stored ? JSON.parse(stored) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const onGetPlaylistByDevice = useCallback(async () => {
        // Only proceed if deviceInfo exists and has a valid deviceId
        if (!deviceInfo?.deviceId) {
            console.warn('DeviceId not available, skipping playlist fetch');
            setPlaylistLoading(false);
            return;
        }

        setPlaylistLoading(true)
        try {
            const data = await getPlaylistByDevice(deviceInfo.deviceId);

            if ('data' in data) {
                setPlaylist(data.data)
            }
        }
        catch (e) {
            console.error('Error fetching playlist by device:', e)
        }
        finally {
            setPlaylistLoading(false)
        }
    }, [deviceInfo, getPlaylistByDevice]);

    return {
        playlist,
        onGetPlaylistByDevice,
        playlistLoading
    }
}