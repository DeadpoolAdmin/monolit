import { replaceUrl } from "@/shared/functions/replaceUrl";
import { IPlaylist } from "@/shared/types/playlist/playlist.interface";
import { LIVETV_MEDIA_SOURCE, VOD_MEDIA_SOURCE } from "@/shared/types/playlist/playlist.source";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux"

export const usePlaylistSettings = (onGetPlaylistByDevice: () => void, playlist: IPlaylist[] | null, downloadPlaylist: (url: string, id: string) => void) => {
    const settingsData = useSelector((state: any) => state.settingsData.settingsData);
    const deviceInfo = useSelector((state: any) => state.deviceInfo?.deviceInfo);
    const hasFetchedPlaylist = useRef(false);

    useEffect(() => {
        if (settingsData && deviceInfo?.deviceId && !hasFetchedPlaylist.current) {
            onGetPlaylistByDevice();
            hasFetchedPlaylist.current = true;
        }
    }, [settingsData, deviceInfo?.deviceId, onGetPlaylistByDevice])

    useEffect(() => {
        if (settingsData) {
            window.LIVETV_TYPE = settingsData.liveTvSouce;
            window.VOD_TYPE = settingsData.vodSouce;
        }
    }, [settingsData])

    useEffect(() => {
        if (settingsData) {
            const VOD_SOURCE = settingsData.vodSouce
            const LIVETV_SOURCE = settingsData.liveTvSouce

            if (VOD_SOURCE == VOD_MEDIA_SOURCE.IPTV_PLAYLIST || LIVETV_SOURCE === LIVETV_MEDIA_SOURCE.IPTV_PLAYLIST) {
                if (playlist && playlist.length) {
                    if (playlist[0].type === 'm3u8') {
                        if (!playlist[0].path) {
                            downloadPlaylist(playlist[0].url, playlist[0]._id);
                        }
                        localStorage.setItem('playlistId', playlist[0]._id)
                    }
                }
            }

            if (VOD_SOURCE === VOD_MEDIA_SOURCE.IPTV_PLAYLIST) {
                if (playlist && playlist.length) {
                    if (playlist[0].type === 'm3u8') {
                        window.VOD_SOURCE = 'm3u8'
                    }
                    else {
                        window.PLAYLIST_URL = replaceUrl(playlist[0].url);

                        window.VOD_SOURCE = playlist[0].type;
                        window.VOD_SOURCE = 'xtream'
                    }
                }
            }
            else if (VOD_SOURCE === VOD_MEDIA_SOURCE.MANUALLY_ADDED) {
                window.PLAYLIST_URL = '',
                    window.VOD_SOURCE = 'api'
            }

            if (LIVETV_SOURCE === LIVETV_MEDIA_SOURCE.IPTV_PLAYLIST) {
                if (playlist && playlist.length) {
                    if (playlist[0].type === 'm3u8') {
                        window.LIVETV_SOURCE = 'm3u8'
                    }
                    else {
                        window.PLAYLIST_URL = replaceUrl(playlist[0].url);
                        window.LIVETV_SOURCE = playlist[0].type;
                        window.LIVETV_SOURCE = 'xtream'

                        if (localStorage.getItem('playlistId')) {
                            localStorage.removeItem('playlistId')
                        }
                    }
                }
            }
            else if (LIVETV_SOURCE === LIVETV_MEDIA_SOURCE.MANUALLY_ADDED) {
                if (localStorage.getItem('playlistId')) {
                    localStorage.removeItem('playlistId')
                }
                window.LIVETV_SOURCE = 'api'
            }
            else if (LIVETV_SOURCE === LIVETV_MEDIA_SOURCE.CABLE_TV) {
                window.LIVETV_SOURCE = 'cable_tv';
                if (localStorage.getItem('playlistId')) {
                    localStorage.removeItem('playlistId')
                }
            }
        }
    }, [playlist, settingsData, downloadPlaylist])

}