import { useGetXtreamInfoQuery } from "@/services/Media/PlaylistApi/XtreamInfoApi";
import { useEffect } from "react";

export const useXtreamInfo = () => {
    const { data: xtreamInfo } = useGetXtreamInfoQuery({ skip: !window.PLAYLIST_URL });


    useEffect(() => {
        if (xtreamInfo) {
            localStorage.setItem('username', xtreamInfo.user_info.username);
            localStorage.setItem('password', xtreamInfo.user_info.password);
            
            const playlistUrl = window.PLAYLIST_URL?.split("/").slice(0, 3).join("/") || '';

            localStorage.setItem('playlist', playlistUrl);
            

        }
    }, [xtreamInfo])
}